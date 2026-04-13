import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/hooks/use-translation';

export function ContentBreadcrumb() {
  const { currentLanguage } = useTranslation();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(segment => segment !== '');
  const breadcrumbSegments = [];
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbSegments.push({ path: currentPath, label: segment });
  }

  const getTranslatedText = (text: string) => {
    if (currentLanguage !== "KR") return text;
    
    const translations: Record<string, string> = {
      "Home": "홈",
      "About Tunisia": "튀니지 소개"
    };
    
    return translations[text] || text;
  };

  return (
    <nav className="bg-gray-50 py-3 px-4 rounded-md">
      <ol className="list-none p-0 inline-flex items-center">
        <li className="flex items-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            {getTranslatedText("Home")}
          </Link>
          <svg className="fill-current w-3 h-3 mx-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.029c9.373 9.372 9.373 24.568.001 33.942z"/>
          </svg>
        </li>
        {breadcrumbSegments.map((segment, index) => (
          <li className="flex items-center" key={index}>
            <Link
              to={segment.path}
              className="text-gray-500 hover:text-gray-700"
            >
              {getTranslatedText("About Tunisia")}
            </Link>
            {index < breadcrumbSegments.length - 1 && (
              <svg className="fill-current w-3 h-3 mx-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.029c9.373 9.372 9.373 24.568.001 33.942z"/>
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
