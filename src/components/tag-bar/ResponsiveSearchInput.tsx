
import React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";

interface ResponsiveSearchInputProps {
  searchValue: string;
  currentLanguage: string;
  isLoading: boolean;
  isMobile?: boolean;
  isExpanded: boolean;
  onInputChange: (value: string) => void;
  onInputClick: () => void;
  onInputFocus: () => void;
  onInputBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
}

export const ResponsiveSearchInput: React.FC<ResponsiveSearchInputProps> = ({
  searchValue,
  currentLanguage,
  isLoading,
  isMobile = false,
  isExpanded,
  onInputChange,
  onInputClick,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onClearSearch,
}) => {
  return (
    <div className={`relative transition-all duration-300 ${isExpanded ? 'w-full' : 'w-full'}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
        
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onInputChange(e.target.value)}
          onClick={onInputClick}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
          placeholder={currentLanguage === 'KR' ? "검색하기..." : "Search..."}
          className={`
            w-full pl-10 pr-12 py-2.5 
            border border-gray-200 rounded-xl
            bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-300
            text-sm
            ${isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'}
            ${isMobile ? 'text-base' : 'text-sm'}
          `}
          style={{ 
            fontFamily: `'Pretendard', 'Noto Sans KR', 'Inter', sans-serif`,
            letterSpacing: '-0.01em'
          }}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          )}
          
          {searchValue && (
            <button
              onClick={onClearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
