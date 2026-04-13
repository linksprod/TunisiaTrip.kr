import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { BlogArticle } from "@/types/blog";
import { renderMarkdownToHTML, renderSafeMarkdownToHTML } from "../admin/richtext/markdownUtils";
import { ImageLightbox } from "./ImageLightbox";
import { SocialShareWidget } from "@/components/seo/SocialMediaIntegration";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ArticleLayoutProps {
  article: BlogArticle;
  recommendedArticles?: BlogArticle[];
}

const getLanguageSpecificContent = (content: any) => {
  if (!content) return "";
  
  if (typeof content === "string") {
    return content;
  }
  
  if (typeof content === "object") {
    return content.en || content.kr || "";
  }
  
  return "";
};

const getLanguageSpecificTitle = (article: BlogArticle) => {
  return article.title || "";
};

const generateArticleUrl = (article: any) => {
  if (article.slug) {
    return `/blog/${article.slug}`;
  }
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `/blog/${slug}-${article.id}`;
};

export function ArticleLayout({ article, recommendedArticles = [] }: ArticleLayoutProps) {
  const { currentLanguage } = useTranslation();
  const [lightboxImage, setLightboxImage] = React.useState<{
    src: string;
    alt: string;
  } | null>(null);
  
  const content = getLanguageSpecificContent(article.content);
  const title = getLanguageSpecificTitle(article);

  // Open Graph metadata - always use production domain
  const articleUrl = `https://tunisiatrip.kr${generateArticleUrl(article)}`;
  const articleImageUrl = (() => {
    const src = article.image;
    if (src?.startsWith('http')) return src;
    const path = src ? (src.startsWith('/') ? src : `/${src}`) : '/og-image.png';
    return `https://tunisiatrip.kr${path}`;
  })();
  const articleLocale = currentLanguage === "KR" ? "ko_KR" : "en_US";


  const formattedDate = new Date(article.publish_date || article.created_at).toLocaleDateString(
    currentLanguage === "KR" ? "ko-KR" : "en-US",
    { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  );

  return (
    <>
      {/* Essential metadata - Open Graph handled by DynamicMetaTags */}
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={articleUrl} />
        <meta name="description" content={article.description} />

        {/* Article metadata */}
        {article.publish_date && (
          <meta property="article:published_time" content={article.publish_date} />
        )}
        {article.updated_at && (
          <meta property="article:modified_time" content={article.updated_at} />
        )}
      </Helmet>

    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog" className="flex items-center text-[#347EFF] hover:text-[#2563eb]">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    <TranslateText text="Back to Blog" language={currentLanguage} />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">
                  <TranslateText text={title} language={currentLanguage} />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <article className="bg-white">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-[#347EFF] text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentLanguage === "KR" ? "여행 & 자연" : "Travel & Nature"}
                </span>
              </div>

              {/* Article Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                <TranslateText text={title} language={currentLanguage} />
              </h1>

              {/* Meta Information */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    <TranslateText text="Travel Guide" language={currentLanguage} />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    <TranslateText text="5 min read" language={currentLanguage} />
                  </span>
                </div>
              </div>

              {/* Social Share Widget */}
              <div className="mb-8">
                <SocialShareWidget
                  title={title}
                  description={article.description}
                  url={articleUrl}
                  image={articleImageUrl}
                />
              </div>

              {/* Featured Image */}
              {article.image && (
                <div className="mb-8">
                  <img
                    src={article.image}
                    alt={title}
                    className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="max-w-none blog-content formatted-content preserve-spaces">
                {typeof content === "string" ? (
                  <div dangerouslySetInnerHTML={renderSafeMarkdownToHTML(content)} />
                ) : (
                  <div className="text-gray-800 leading-relaxed">
                    <TranslateText text={content} language={currentLanguage} />
                  </div>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Related Articles */}
              {recommendedArticles.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    <TranslateText text="Related Articles" language={currentLanguage} />
                  </h3>
                  <div className="space-y-4">
                    {recommendedArticles.slice(0, 3).map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        to={generateArticleUrl(relatedArticle)}
                        className="flex gap-3 p-3 rounded-lg hover:bg-white transition-colors group"
                      >
                        <img
                          src={relatedArticle.image || "/placeholder.svg"}
                          alt={relatedArticle.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#347EFF] transition-colors">
                            <TranslateText text={relatedArticle.title} language={currentLanguage} />
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(relatedArticle.publish_date || relatedArticle.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link 
                    to="/blog"
                    className="inline-block text-[#347EFF] hover:text-[#2563eb] text-sm font-medium mt-4 transition-colors"
                  >
                    <TranslateText text="View all articles →" language={currentLanguage} />
                  </Link>
                </div>
              )}

              {/* Popular Activities */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <TranslateText text="Popular Activities" language={currentLanguage} />
                </h3>
                <div className="space-y-3">
                  <Link to="/activities" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Desert Safari Adventures" language={currentLanguage} />
                  </Link>
                  <Link to="/activities" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Medina Walking Tours" language={currentLanguage} />
                  </Link>
                  <Link to="/activities" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Cooking Classes" language={currentLanguage} />
                  </Link>
                </div>
              </div>

              {/* Travel Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  <TranslateText text="Travel Information" language={currentLanguage} />
                </h3>
                <div className="space-y-3">
                  <Link to="/travel-info" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Best Time to Visit" language={currentLanguage} />
                  </Link>
                  <Link to="/travel-info" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Visa Requirements" language={currentLanguage} />
                  </Link>
                  <Link to="/travel-info" className="flex items-center text-gray-700 hover:text-[#347EFF] transition-colors">
                    <span className="w-2 h-2 bg-[#347EFF] rounded-full mr-3"></span>
                    <TranslateText text="Local Transportation" language={currentLanguage} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={!!lightboxImage}
        onClose={() => setLightboxImage(null)}
        imageSrc={lightboxImage?.src || ''}
        imageAlt={lightboxImage?.alt || ''}
      />
      </div>
    </>
  );
}