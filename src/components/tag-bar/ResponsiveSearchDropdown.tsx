
import React from "react";
import { Clock, TrendingUp, Loader2 } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { UnifiedSearchResult } from "@/hooks/use-unified-search";

interface ResponsiveSearchDropdownProps {
  showContent: boolean;
  isLoading: boolean;
  searchValue: string;
  results: UnifiedSearchResult[];
  suggestions: string[];
  history: string[];
  currentLanguage: string;
  isMobile?: boolean;
  onResultClick: (result: UnifiedSearchResult) => void;
  onHistoryClick: (historyItem: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

export const ResponsiveSearchDropdown: React.FC<ResponsiveSearchDropdownProps> = ({
  showContent,
  isLoading,
  searchValue,
  results,
  suggestions,
  history,
  currentLanguage,
  isMobile = false,
  onResultClick,
  onHistoryClick,
  onSuggestionClick,
  dropdownRef,
}) => {
  if (!showContent) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[70] max-h-96 overflow-y-auto"
      style={{ 
        fontFamily: `'Pretendard', 'Noto Sans KR', 'Inter', sans-serif`,
        letterSpacing: '-0.01em'
      }}
    >
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
          <span className="text-gray-600 text-sm">
            <TranslateText text="Searching..." language={currentLanguage} />
          </span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Search Results */}
          {results.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                <TranslateText text="Results" language={currentLanguage} />
              </div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => onResultClick(result)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {result.title}
                  </div>
                  {result.description && (
                    <div className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {result.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && !searchValue.trim() && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <TranslateText text="Popular Searches" language={currentLanguage} />
              </div>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {history.length > 0 && !searchValue.trim() && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <TranslateText text="Recent Searches" language={currentLanguage} />
              </div>
              {history.slice(0, 3).map((historyItem, index) => (
                <button
                  key={index}
                  onClick={() => onHistoryClick(historyItem)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {historyItem}
                </button>
              ))}
            </div>
          )}

          {/* No results state */}
          {!isLoading && results.length === 0 && searchValue.trim() && (
            <div className="p-4 text-center text-gray-500 text-sm">
              <TranslateText text="No results found" language={currentLanguage} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
