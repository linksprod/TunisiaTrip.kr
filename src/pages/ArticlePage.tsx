
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DynamicMetaTags } from "@/components/DynamicMetaTags";
import { useGetArticle } from "@/hooks/use-get-article";
import { useRecommendedArticles } from "@/hooks/use-recommended-articles";
import { ArticleLayout } from "@/components/blog/ArticleLayout";
import { useTranslation } from "@/hooks/use-translation";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, isError } = useGetArticle(slug);
  const { recommendedArticles, isLoading: isLoadingRecommended } = useRecommendedArticles(post?.id);
  const { currentLanguage } = useTranslation();
  
  const getLanguageSpecificContent = (content: any) => {
    if (!content) return '';
    
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle language-specific content
    if (currentLanguage === "KR" && content.korean) {
      return content.korean;
    }
    
    return content.english || content.default || '';
  };

  const getLanguageSpecificTitle = (post: any) => {
    if (!post) return '';
    
    if (currentLanguage === "KR" && post.title_korean) {
      return post.title_korean;
    }
    
    return post.title || '';
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
                  {/* Category badge skeleton */}
                  <div className="h-6 bg-gray-200 rounded-full w-24 mb-4"></div>
                  
                  {/* Title skeleton */}
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  
                  {/* Meta info skeleton */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  
                  {/* Image skeleton */}
                  <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                  
                  {/* Content skeleton */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !post) {
    return (
      <MainLayout>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-8 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {currentLanguage === "KR" ? "오류" : "Error"}
            </h2>
            <p className="text-gray-500">
              {currentLanguage === "KR" ? "기사를 불러오는데 실패했습니다." : "Failed to load article."}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <DynamicMetaTags 
        title={getLanguageSpecificTitle(post)}
        description={getLanguageSpecificContent(post?.description)}
        image={post?.image}
        type="article"
      />
      
      <ArticleLayout 
        article={post}
        recommendedArticles={recommendedArticles}
      />
    </MainLayout>
  );
}
