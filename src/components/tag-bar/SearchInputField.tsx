
import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicPlaceholder } from "@/hooks/use-dynamic-placeholder";

interface SearchInputFieldProps {
  searchValue: string;
  currentLanguage: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onInputClick: () => void;
  onInputFocus: () => void;
  onInputBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
  getInputWidth: () => string;
}

export const SearchInputField: React.FC<SearchInputFieldProps> = ({
  searchValue,
  currentLanguage,
  inputRef,
  onInputChange,
  onInputClick,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onClearSearch,
  getInputWidth
}) => {
  const dynamicPlaceholder = useDynamicPlaceholder(currentLanguage);

  return (
    <div 
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        getInputWidth()
      )}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => onInputChange(e.target.value)}
          onClick={onInputClick}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
          placeholder={dynamicPlaceholder}
          className={cn(
            "w-full h-10 sm:h-11",
            "pl-11 pr-12",
            "py-2",
            "border-2 border-gray-200 rounded-full",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "text-sm font-medium",
            "bg-white transition-all duration-200",
            "placeholder:text-gray-500"
          )}
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            onClick={onClearSearch}
            className={cn(
              "absolute right-4",
              "text-gray-400 hover:text-gray-600",
              "p-1.5 rounded-full hover:bg-gray-100",
              "transition-colors duration-200",
              "z-10"
            )}
            type="button"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
