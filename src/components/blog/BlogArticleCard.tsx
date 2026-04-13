import React from "react";
import { Link } from "react-router-dom";
import { TranslateText } from "@/components/translation/TranslateText";
import { stripMarkdown } from "@/utils/markdownUtils";
import { BlogArticle } from "@/types/blog";

interface BlogArticleCardProps {
  article: BlogArticle;
  currentLanguage: string;
}

export function BlogArticleCard({ article, currentLanguage }: BlogArticleCardProps) {

  const generateArticleUrl = (article: BlogArticle) => {
    if (article.slug) {
      return `/blog/${article.slug}`;
    }
    return `/blog/${article.id}`;
  };

  // Extract category from content or default to first available category
  const getArticleCategory = (article: BlogArticle) => {
    // For now, we'll assign categories based on content keywords or default
    const content = (article.content || article.description || '').toLowerCase();
    if (content.includes('culture') || content.includes('tradition')) return 'Culture';
    if (content.includes('history') || content.includes('historic')) return 'History';
    if (content.includes('tip') || content.includes('advice')) return 'Tips';
    if (content.includes('food') || content.includes('cuisine')) return 'Food';
    if (content.includes('hotel') || content.includes('accommodation')) return 'Hotels';
    if (content.includes('event') || content.includes('festival')) return 'Events';
    if (content.includes('place') || content.includes('location')) return 'Places';
    return 'Travel Diary'; // Default category
  };

  const category = getArticleCategory(article);

  return (
    <article className="group h-full">
      <Link to={generateArticleUrl(article)} className="block h-full">
        <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img 
              src={article.image || '/placeholder.svg'} 
              alt={article.title} 
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Contenu */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Catégorie */}
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                <TranslateText text={category} language={currentLanguage} />
              </span>
            </div>
            
            {/* Titre */}
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              <TranslateText text={article.title} language={currentLanguage} />
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
              <TranslateText text={stripMarkdown(article.description)} language={currentLanguage} />
            </p>
            
            {/* Lien "Learn more" */}
            <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform duration-300 mt-auto">
              <span className="mr-1">
                <TranslateText text="Learn more" language={currentLanguage} />
              </span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.68841 0.779785L4.63281 1.91078L10.2124 7.56578L4.63281 13.2208L5.68841 14.3518L12.4744 7.56578L5.68841 0.779785Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}