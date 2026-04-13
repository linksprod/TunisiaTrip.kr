import React, { useState } from "react";  
import { useForm } from "react-hook-form";
import { BlogFormValues } from "@/hooks/use-blog-posts";
import { BlogArticle } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ExternalLink, Languages } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import SEOSettings from "@/components/admin/blog/SEOSettings";
import { translateTitleToKoreanSlug, romanizeKorean } from "@/translations/korean/slugs";
import { useTranslation } from "@/hooks/use-translation";

interface BlogEditorProps {
  isAddMode: boolean;
  currentPost: BlogArticle | null;
  isSubmitting: boolean;
  onSubmit: (data: BlogFormValues) => void;
  onCancel: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  isAddMode,
  currentPost,
  isSubmitting,
  onSubmit,
  onCancel
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'KR'>('EN');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [isSlugManuallyModified, setIsSlugManuallyModified] = useState(false);
  const [isTranslatingSlug, setIsTranslatingSlug] = useState(false);
  
  const { translateText } = useTranslation();
  
  const form = useForm<BlogFormValues>({
    defaultValues: {
      title: currentPost?.title || "",
      slug: currentPost?.slug || "",
      description: currentPost?.description || "",
      content: currentPost?.content || "",
      image: currentPost?.image || "",
      status: currentPost?.status || "draft",
      meta_title: currentPost?.meta_title || "",
      meta_description: currentPost?.meta_description || "",
      meta_keywords: currentPost?.meta_keywords || "",
      focus_keyword: currentPost?.focus_keyword || "",
      canonical_url: currentPost?.canonical_url || ""
    }
  });

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Auto-generate slug when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue("title", title);
    
    // Only auto-generate slug if not manually modified or in add mode
    if (!isSlugManuallyModified || isAddMode) {
      if (selectedLanguage === 'KR') {
        // For Korean, use Korean slug generation
        const koreanSlug = translateTitleToKoreanSlug(title);
        const finalSlug = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(koreanSlug) 
          ? romanizeKorean(koreanSlug) 
          : koreanSlug;
        form.setValue("slug", finalSlug || generateSlug(title));
      } else {
        // For English, use regular slug generation
        form.setValue("slug", generateSlug(title));
      }
    }
  };

  const getPreviewUrl = () => {
    const slug = form.watch("slug");
    const domain = selectedLanguage === 'KR' ? 'tunisiatrip.kr' : 'tunisiatrip.com';
    return `https://${domain}/blog/${slug}`;
  };

  // Handle slug manual modification
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyModified(true);
    form.setValue("slug", e.target.value);
  };

  // Handle language change and automatic slug translation
  const handleLanguageChange = async (language: 'EN' | 'KR') => {
    if (language === selectedLanguage) return;
    
    setSelectedLanguage(language);
    
    if (language === 'KR' && !isSlugManuallyModified) {
      const title = form.getValues("title");
      if (title) {
        setIsTranslatingSlug(true);
        try {
          // First try to translate the title to Korean
          const translatedTitle = await translateText(title, 'KR');
          
          // If translation is different from original, use it
          let slugSource = translatedTitle !== title ? translatedTitle : title;
          
          // Generate Korean-friendly slug
          const koreanSlug = translateTitleToKoreanSlug(slugSource);
          
          // If we have Korean characters, romanize them
          const finalSlug = koreanSlug.includes('한글') || /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(koreanSlug) 
            ? romanizeKorean(koreanSlug) 
            : koreanSlug;
          
          if (finalSlug) {
            form.setValue("slug", finalSlug);
            console.log(`Translated slug: ${title} -> ${translatedTitle} -> ${finalSlug}`);
          }
        } catch (error) {
          console.error('Error translating slug:', error);
          // Fallback to English slug generation
          form.setValue("slug", generateSlug(form.getValues("title")));
        } finally {
          setIsTranslatingSlug(false);
        }
      }
    }
  };

  const handleSubmit = (data: BlogFormValues) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isAddMode ? "Create New Blog Post" : "Edit Blog Post"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Title Section */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register("title", { required: "Title is required" })}
              onChange={handleTitleChange}
              placeholder="Enter blog post title"
              className="w-full"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Slug Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="slug">Slug</Label>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  id="slug"
                  {...form.register("slug", { required: "Slug is required" })}
                  onChange={handleSlugChange}
                  placeholder="blog-post-slug"
                  className="w-full font-mono pr-10"
                />
                {isTranslatingSlug && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Languages className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={selectedLanguage === 'EN' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange('EN')}
                  className="px-3 py-1 text-xs"
                  disabled={isTranslatingSlug}
                >
                  EN
                </Button>
                <Button
                  type="button"
                  variant={selectedLanguage === 'KR' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange('KR')}
                  className="px-3 py-1 text-xs"
                  disabled={isTranslatingSlug}
                >
                  KR {isTranslatingSlug && selectedLanguage === 'KR' && '⏳'}
                </Button>
                {isSlugManuallyModified && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (manually modified)
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                URL: {getPreviewUrl()}
              </div>
              {selectedLanguage === 'KR' && (
                <div className="text-xs text-muted-foreground">
                  💡 Clicking KR will auto-translate the title and generate a Korean-friendly slug
                </div>
              )}
            </div>
            {form.formState.errors.slug && (
              <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
            )}
          </div>

          {/* Short Description Section */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              {...form.register("description", { required: "Description is required" })}
              placeholder="Enter a short description"
              className="w-full resize-none"
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              value={form.watch("content")}
              onChange={(content) => form.setValue("content", content)}
            />
          </div>

          {/* Blog Post Image Section */}
          <div className="space-y-2">
            <Label>Blog Post Image</Label>
            <ImageUploader
              onImageUploaded={(url) => form.setValue("image", url)}
              currentImage={form.watch("image")}
              folder="blog"
            />
            {form.formState.errors.image && (
              <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>
            )}
          </div>

          {/* Status Section */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={form.watch("status")} onValueChange={(value: 'draft' | 'published') => form.setValue("status", value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SEO Settings Section - Collapsible */}
          <Collapsible open={seoExpanded} onOpenChange={setSeoExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between" type="button">
                SEO Settings
                <ChevronDown className={`h-4 w-4 transition-transform ${seoExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <SEOSettings form={form} />
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-admin-primary hover:bg-admin-accent transition-colors"
            >
              {isSubmitting ? "Saving..." : isAddMode ? "Create Post" : "Update Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogEditor;