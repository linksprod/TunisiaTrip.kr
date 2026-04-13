
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogArticle } from '@/types/blog';

export function useGetArticle(slug: string | undefined) {
  const [post, setPost] = useState<BlogArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        console.log('Fetching article with slug:', slug);

        let data = null;
        let error = null;

        // 1. First try to search by exact slug match
        console.log('Trying to fetch by slug:', slug);
        const slugResult = await supabase
          .from('blog_articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (slugResult.data) {
          console.log('Found article by slug');
          data = slugResult.data;
        } else if (slugResult.error) {
          console.log('Error searching by slug:', slugResult.error);
        }

        // 2. If not found and slug contains UUID at end, try UUID extraction
        if (!data && slug.length >= 36) {
          const extractedId = slug.slice(-36);
          console.log('Trying to fetch by extracted UUID:', extractedId);
          
          const uuidResult = await supabase
            .from('blog_articles')
            .select('*')
            .eq('id', extractedId)
            .eq('status', 'published')
            .maybeSingle();

          if (uuidResult.data) {
            console.log('Found article by extracted UUID');
            data = uuidResult.data;
          } else if (uuidResult.error) {
            console.log('Error searching by UUID:', uuidResult.error);
          }
        }

        // 3. If still not found and slug looks like a UUID, try direct ID search
        if (!data && slug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          console.log('Trying to fetch by direct ID:', slug);
          
          const idResult = await supabase
            .from('blog_articles')
            .select('*')
            .eq('id', slug)
            .eq('status', 'published')
            .maybeSingle();

          if (idResult.data) {
            console.log('Found article by direct ID');
            data = idResult.data;
          } else if (idResult.error) {
            console.log('Error searching by ID:', idResult.error);
            error = idResult.error;
          }
        }

        if (error) {
          console.error('Error fetching article:', error);
          setIsError(true);
          return;
        }

        if (!data) {
          console.log('No article found for slug:', slug);
          setIsError(true);
          return;
        }

        console.log('Successfully fetched article:', data.title);
        setPost(data as BlogArticle);
      } catch (error) {
        console.error('Exception fetching article:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  return { post, isLoading, isError };
}
