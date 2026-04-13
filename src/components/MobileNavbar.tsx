
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { LanguageSelector } from "./translation/LanguageSelector";
import { useTranslation } from "@/hooks/use-translation";

export function MobileNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [showTravelDropdown, setShowTravelDropdown] = useState(false);
  const { currentLanguage } = useTranslation();
  
  return (
    <>
      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-md border-b border-gray-100 sticky top-0 z-[60]">
        <div className="flex items-center justify-between px-4 py-3 h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/a652eb0a-374b-4bb7-9cc1-497b38510262.png"
              alt="Tunisia Trip Logo"
              className="h-9 w-auto"
            />
          </Link>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-800 hover:text-primary"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay - Enhanced styling */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-xl z-50 animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-6 space-y-3">
              {/* Main Navigation */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="block py-3 px-2 text-gray-800 hover:text-primary hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentLanguage === "KR" ? "홈" : "Home"}
                </Link>
                
                {/* Enhanced About Tunisia Dropdown */}
                <div className="py-1">
                  <button 
                    onClick={() => setShowAboutDropdown(!showAboutDropdown)}
                    className="flex items-center justify-between w-full text-gray-800 hover:text-primary hover:bg-orange-50 font-semibold py-3 px-2 rounded-lg transition-colors"
                  >
                    <span>{currentLanguage === "KR" ? "튀니지에 대해" : "About Tunisia"}</span>
                    <ChevronDown size={18} className={`transform transition-transform duration-200 ${showAboutDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showAboutDropdown && (
                    <div className="ml-4 mt-2 space-y-1 bg-gray-50 rounded-xl p-3 animate-fadeIn">
                      <Link 
                        to="/about-tunisia" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "개요" : "Overview"}
                      </Link>
                      <Link 
                        to="/about-tunisia/location" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "국가 위치" : "Country Location"}
                      </Link>
                      <Link 
                        to="/about-tunisia/culture" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "문화" : "Culture"}
                      </Link>
                      <Link 
                        to="/about-tunisia/cities" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "도시들" : "Cities"}
                      </Link>
                      <Link 
                        to="/about-tunisia/regions" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "지역" : "Regions"}
                      </Link>
                      <Link 
                        to="/about-tunisia/weather" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "날씨" : "Weather"}
                      </Link>
                      <Link 
                        to="/about-tunisia/languages" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "언어" : "Spoken Languages"}
                      </Link>
                      <Link 
                        to="/about-tunisia/religions" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "종교" : "Practiced Religions"}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Enhanced Travel Information Dropdown */}
                <div className="py-1">
                  <button 
                    onClick={() => setShowTravelDropdown(!showTravelDropdown)}
                    className="flex items-center justify-between w-full text-gray-800 hover:text-primary hover:bg-orange-50 font-semibold py-3 px-2 rounded-lg transition-colors"
                  >
                    <span>{currentLanguage === "KR" ? "여행 정보" : "Travel Information"}</span>
                    <ChevronDown size={18} className={`transform transition-transform duration-200 ${showTravelDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showTravelDropdown && (
                    <div className="ml-4 mt-2 space-y-1 bg-gray-50 rounded-xl p-3 animate-fadeIn">
                      <Link 
                        to="/travel-information" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "개요" : "Overview"}
                      </Link>
                      <Link 
                        to="/travel-information/itinerary" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "여행 일정" : "Itinerary"}
                      </Link>
                      <Link 
                        to="/travel-information/activities" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "활동" : "Activities"}
                      </Link>
                      <Link 
                        to="/travel-information/tips" 
                        className="block py-3 px-4 text-sm text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-colors font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {currentLanguage === "KR" ? "여행 팁" : "Travel Tips"}
                      </Link>
                    </div>
                  )}
                </div>

                <Link 
                  to="/blog" 
                  className="block py-3 px-2 text-gray-800 hover:text-primary hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentLanguage === "KR" ? "블로그" : "Blog"}
                </Link>

                <Link 
                  to="/company-information" 
                  className="block py-3 px-2 text-gray-800 hover:text-primary hover:bg-orange-50 font-semibold rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentLanguage === "KR" ? "아틀란티스에 대해" : "About Atlantis"}
                </Link>
                
                {/* Enhanced CTA Button */}
                <div className="pt-6">
                  <Link 
                    to="/start-my-trip" 
                    className="block w-full text-center bg-primary text-primary-foreground px-6 py-4 rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                     <Sparkles className="h-5 w-5" />
                    {currentLanguage === "KR" ? "여행 시작하기" : "Start My Trip"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
