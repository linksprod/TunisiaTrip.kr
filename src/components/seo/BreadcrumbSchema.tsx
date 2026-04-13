import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema() {
  const location = useLocation();
  const { currentLanguage } = useTranslation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        name: currentLanguage === 'KR' ? '홈' : 'Home',
        url: window.location.origin
      }
    ];

    let currentPath = '';
    
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map path segments to readable names
      const segmentNames: { [key: string]: { ko: string, en: string } } = {
        'travel-information': { ko: '여행 정보', en: 'Travel Information' },
        'atlantis': { ko: '아틀란티스 투어', en: 'Atlantis Tour' },
        'about-tunisia': { ko: '튀니지 소개', en: 'About Tunisia' },
        'blog': { ko: '블로그', en: 'Blog' },
        'food': { ko: '튀니지 음식', en: 'Tunisia Food' },
        'activities': { ko: '액티비티', en: 'Activities' },
        'weather': { ko: '날씨', en: 'Weather' },
        'contact': { ko: '연락처', en: 'Contact' }
      };
      
      const segmentName = segmentNames[segment];
      const name = segmentName 
        ? (currentLanguage === 'KR' ? segmentName.ko : segmentName.en)
        : segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        name,
        url: window.location.origin + currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs for home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

// Visual breadcrumb component for UI
export function VisualBreadcrumb() {
  const location = useLocation();
  const { currentLanguage } = useTranslation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      {
        name: currentLanguage === 'KR' ? '홈' : 'Home',
        url: '/'
      }
    ];

    let currentPath = '';
    
    pathnames.forEach((segment) => {
      currentPath += `/${segment}`;
      
      const segmentNames: { [key: string]: { ko: string, en: string } } = {
        'travel-information': { ko: '여행 정보', en: 'Travel Information' },
        'atlantis': { ko: '아틀란티스 투어', en: 'Atlantis Tour' },
        'about-tunisia': { ko: '튀니지 소개', en: 'About Tunisia' },
        'blog': { ko: '블로그', en: 'Blog' },
        'food': { ko: '튀니지 음식', en: 'Tunisia Food' },
        'activities': { ko: '액티비티', en: 'Activities' },
        'weather': { ko: '날씨', en: 'Weather' },
        'contact': { ko: '연락처', en: 'Contact' }
      };
      
      const segmentName = segmentNames[segment];
      const name = segmentName 
        ? (currentLanguage === 'KR' ? segmentName.ko : segmentName.en)
        : segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        name,
        url: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs for home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <>
      <BreadcrumbSchema />
      <nav aria-label="Breadcrumb" className="py-2 px-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.url} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-foreground font-medium">{breadcrumb.name}</span>
              ) : (
                <a 
                  href={breadcrumb.url} 
                  className="hover:text-foreground transition-colors"
                >
                  {breadcrumb.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}