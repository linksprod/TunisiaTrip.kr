import { useMemo } from 'react';
import { useBlogPosts } from './use-blog-posts';

export function useRecommendedArticles(currentArticleId?: string) {
  const { blogPosts, isLoading } = useBlogPosts(); // Public mode - only published articles
  
  const recommendedArticles = useMemo(() => {
    return blogPosts
      .filter(article => article.id !== currentArticleId)
      .slice(0, 3);
  }, [blogPosts, currentArticleId]);

  return {
    recommendedArticles,
    isLoading
  };
}