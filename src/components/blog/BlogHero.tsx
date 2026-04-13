import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "../translation/TranslateText";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { BlogArticleCard } from "./BlogArticleCard";
import { 
  BookOpen, 
  MapPin, 
  Hotel,
  Utensils,
  Calendar,
  Globe2,
  History,
  Lightbulb
} from "lucide-react";

// Category configuration based on screenshots
const categories = [
  { name: "Travel Diary", slug: "travel-diary", icon: BookOpen, color: "bg-blue-100", textColor: "text-blue-600" },
  { name: "Places", slug: "places", icon: MapPin, color: "bg-green-100", textColor: "text-green-600" },
  { name: "Hotels", slug: "hotels", icon: Hotel, color: "bg-purple-100", textColor: "text-purple-600" },
  { name: "Food", slug: "food", icon: Utensils, color: "bg-yellow-100", textColor: "text-yellow-600" },
  { name: "Events", slug: "events", icon: Calendar, color: "bg-red-100", textColor: "text-red-600" },
  { name: "Culture", slug: "culture", icon: Globe2, color: "bg-indigo-100", textColor: "text-indigo-600" },
  { name: "History", slug: "history", icon: History, color: "bg-amber-100", textColor: "text-amber-600" },
  { name: "Tips", slug: "tips", icon: Lightbulb, color: "bg-teal-100", textColor: "text-teal-600" },
];


export function BlogHero() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useTranslation();
  const { blogPosts, isLoading } = useBlogPosts(); // Public mode - only published articles

  // Filter articles based on selected category
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return blogPosts;
    
    return blogPosts.filter(article => {
      const content = (article.content || article.description || '').toLowerCase();
      const categoryName = categories.find(cat => cat.slug === selectedCategory)?.name.toLowerCase();
      if (!categoryName) return false;
      
      // Match category based on content keywords
      switch (selectedCategory) {
        case 'culture':
          return content.includes('culture') || content.includes('tradition');
        case 'history':
          return content.includes('history') || content.includes('historic');
        case 'tips':
          return content.includes('tip') || content.includes('advice');
        case 'food':
          return content.includes('food') || content.includes('cuisine');
        case 'hotels':
          return content.includes('hotel') || content.includes('accommodation');
        case 'events':
          return content.includes('event') || content.includes('festival');
        case 'places':
          return content.includes('place') || content.includes('location');
        default:
          return true; // For 'travel-diary' or fallback
      }
    });
  }, [blogPosts, selectedCategory]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Categories Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <TranslateText text="Explore by Category" language={currentLanguage} />
          </h2>
          <p className="text-gray-600">
            <TranslateText text="Find stories that match your interests" language={currentLanguage} />
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={category.slug}
                onClick={() => setSelectedCategory(category.slug === selectedCategory ? null : category.slug)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.slug ? 'ring-2 ring-blue-500 scale-105' : 'hover:shadow-lg'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${category.textColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-800 text-center">
                  <TranslateText text={category.name} language={currentLanguage} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Articles Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            <TranslateText 
              text={selectedCategory ? `${categories.find(cat => cat.slug === selectedCategory)?.name} Articles` : "Featured Articles"} 
              language={currentLanguage} 
            />
          </h2>
          <p className="text-gray-600">
            <TranslateText 
              text={selectedCategory ? "Discover stories from this category" : "Explore our latest travel stories and experiences"} 
              language={currentLanguage} 
            />
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Articles Grid */}
        {!isLoading && (
          <>
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <BlogArticleCard
                    key={article.id}
                    article={article}
                    currentLanguage={currentLanguage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  <TranslateText 
                    text={selectedCategory ? "No articles found in this category" : "No articles available"} 
                    language={currentLanguage} 
                  />
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <TranslateText text="View all articles" language={currentLanguage} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}