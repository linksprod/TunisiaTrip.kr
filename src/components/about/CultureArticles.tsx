import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface CultureArticle {
  category: string;
  title: string;
  description: string;
  image: string;
}

const cultureArticles: CultureArticle[] = [
  {
    category: "Cuisine",
    title: "World's leading olive producers",
    description: "known for its wide variety of olive varieties. The country's climate and soil are ideal for growing olives, so High quality olives It boasts of its production. Locally...",
    image: "/lovable-uploads/cb1753c7-4a7d-4f89-984e-fc285bc55c65.png"
  },
  {
    category: "Cuisine",
    title: "Traditional Tunisian Food",
    description: "In Tunisia, there is a traditional food that tourists must try: couscous. This food is made with steam-cooked semolina wheat flour and meat, With greens...",
    image: "/lovable-uploads/160dc00b-e9d5-4c2a-9784-30a40c8763eb.png"
  },
  {
    category: "Cities",
    title: "UNESCO-listed City",
    description: "Khairuan in Tunisia is a UNESCO-listed city known for its rich history and cultural heritage. The medina of Kairuan is a narrow street with a market In a place...",
    image: "/lovable-uploads/c1965a9c-b076-4bd5-8627-87405031a622.png"
  },
  {
    category: "History",
    title: "History & Arts",
    description: "Tunisia is home to many historical sites that are important for world archaeology and architectural research. In addition, handicrafts such as carpets...",
    image: "/lovable-uploads/cb022f6c-d70b-4cf6-8fc6-28d5dca9c643.png"
  },
  {
    category: "Cuisine",
    title: "Popular Food in Tunisia",
    description: "Tunisian food is a mix of Eastern and Western cuisines. There are many dishes based on olive oil, spices, tomatoes, seafood, and meat. Chili pepper...",
    image: "/lovable-uploads/a6255dc3-e107-4750-9b51-4921e17117ec.png"
  },
  {
    category: "Culture",
    title: "National Sport",
    description: "Sports are becoming more and more popular in Tunisia. In particular, football is quite popular. In October 2020, the Tunisian national football team FIFA...",
    image: "/lovable-uploads/9b60f3ff-33bb-4e82-9aa3-5bdbdef2519c.png"
  }
];

export interface CultureArticlesProps {
  getCardColumnClass: () => string;
}

export function CultureArticles({ getCardColumnClass }: CultureArticlesProps) {
  const { currentLanguage } = useTranslation();
  
  const getCategoryTranslation = (category: string) => {
    if (currentLanguage !== "KR") return category;
    
    const translations: Record<string, string> = {
      "Cuisine": "요리",
      "Cities": "도시",
      "History": "역사",
      "Culture": "문화"
    };
    
    return translations[category] || category;
  };
  
  return (
    <div className={`grid ${getCardColumnClass()} gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12`}>
      {cultureArticles.map((article, index) => (
        <div key={index} className="flex flex-col group">
          <div className="overflow-hidden rounded-xl mb-4 sm:mb-5 shadow-sm">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-[200px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="px-1">
            <p className="text-primary text-sm sm:text-base font-medium mb-2 sm:mb-3">
              {getCategoryTranslation(article.category)}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
              <TranslateText text={article.title} language={currentLanguage} />
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
              <TranslateText text={article.description} language={currentLanguage} />
            </p>
            <div className="flex items-center gap-2 text-primary cursor-pointer hover:text-primary/80 transition-colors duration-200 group">
              <span className="text-sm sm:text-base font-medium">
                <TranslateText text="Learn more" language={currentLanguage} />
              </span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
