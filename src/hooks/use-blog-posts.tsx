import { useState, useEffect } from "react";
import { BlogArticle } from "@/types/blog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export interface BlogFormValues {
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  canonical_url?: string;
}

// Local interface for database operations without category
interface BlogArticleDB {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  content?: string;
  image: string;
  status: 'draft' | 'published';
  publish_date?: string;
  created_at?: string;
  updated_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  canonical_url?: string;
}

export const useBlogPosts = (adminMode: boolean = false) => {
  const [blogPosts, setBlogPosts] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Function to generate URL-friendly slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        
        if (!isMounted) return;
        
        let query = supabase
          .from('blog_articles')
          .select('*')
          .order('created_at', { ascending: false });
        
        // For public users (non-admin mode), only fetch published articles
        if (!adminMode) {
          query = query.eq('status', 'published');
        }
        
        const { data, error } = await query;
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error fetching blog posts:", error);
          toast({
            title: "Error",
            description: "Failed to load articles",
            variant: "destructive"
          });
          return;
        }
        
        console.log("Fetched blog posts:", data);
        setBlogPosts(data as BlogArticle[]);
      } catch (error) {
        if (isMounted) {
          console.error("Exception fetching blog posts:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred while loading articles",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch articles for both authenticated and unauthenticated users
    // Admin mode requires authentication, public mode doesn't
    if (adminMode && !user) {
      setIsLoading(false);
      return;
    }
    
    fetchBlogPosts();
    
    return () => {
      isMounted = false;
    };
  }, [user, adminMode, toast]);
  
  const handleAddPost = async (formData: BlogFormValues) => {
    try {
      setIsSubmitting(true);
      
      const slug = formData.slug || generateSlug(formData.title);
      
      const newPost: BlogArticleDB = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content,
        image: formData.image,
        status: formData.status,
        publish_date: formData.status === 'published' ? new Date().toISOString() : undefined,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        focus_keyword: formData.focus_keyword,
        canonical_url: formData.canonical_url
      };
      
      const { data, error } = await supabase
        .from('blog_articles')
        .insert([newPost])
        .select();
      
      if (error) {
        console.error("Error adding blog post:", error);
        toast({
          title: "Error",
          description: "Failed to add blog post",
          variant: "destructive"
        });
        return false;
      }
      
      if (data) {
        setBlogPosts(prevPosts => [...(data as BlogArticle[]), ...prevPosts]);
      }
      
      toast({
        title: "Success",
        description: formData.status === 'published' 
          ? "Blog post published successfully" 
          : "Blog post saved as draft"
      });
      
      return true;
    } catch (error) {
      console.error("Exception adding blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePost = async (formData: BlogFormValues, currentPost: BlogArticle) => {
    try {
      setIsSubmitting(true);
      
      const wasPublished = currentPost.status === 'published';
      const isPublishedNow = formData.status === 'published';
      
      const slug = formData.slug || (formData.title !== currentPost.title ? 
        generateSlug(formData.title) : currentPost.slug);
      
      const updates: Partial<BlogArticleDB> = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content,
        image: formData.image,
        status: formData.status,
        updated_at: new Date().toISOString(),
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
        focus_keyword: formData.focus_keyword,
        canonical_url: formData.canonical_url,
        ...((!wasPublished && isPublishedNow) ? { publish_date: new Date().toISOString() } : {})
      };
      
      const { error } = await supabase
        .from('blog_articles')
        .update(updates)
        .eq('id', currentPost.id);
      
      if (error) {
        console.error("Error updating blog post:", error);
        toast({
          title: "Error",
          description: "Failed to update blog post",
          variant: "destructive"
        });
        return false;
      }
      
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === currentPost.id 
            ? { ...post, ...updates } as BlogArticle
            : post
        )
      );
      
      toast({
        title: "Success",
        description: "Blog post updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error("Exception updating blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const confirmDeletePost = (id: string) => {
    setPostToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      const { error } = await supabase
        .from('blog_articles')
        .delete()
        .eq('id', postToDelete);
      
      if (error) {
        console.error("Error deleting blog post:", error);
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive"
        });
        return;
      }
      
      setBlogPosts(prevPosts => 
        prevPosts.filter(post => post.id !== postToDelete)
      );
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
      
    } catch (error) {
      console.error("Exception deleting blog post:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
    }
  };
  
  return {
    blogPosts,
    isLoading,
    isSubmitting,
    deleteConfirmOpen,
    postToDelete,
    handleAddPost,
    handleUpdatePost,
    confirmDeletePost,
    handleDeletePost,
    setDeleteConfirmOpen
  };
};