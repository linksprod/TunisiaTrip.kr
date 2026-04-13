
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelector } from "./translation/LanguageSelector";
import { useTranslation } from "@/hooks/use-translation";
import { Sparkles, ChevronDown } from "lucide-react";

export function Navbar() {
  const { currentLanguage } = useTranslation();
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src="/lovable-uploads/a652eb0a-374b-4bb7-9cc1-497b38510262.png"
                alt="Tunisia Trip Logo"
                className="h-8 w-auto"
              />
            </Link>

            {/* Navigation Links - Show all items on xl screens */}
            <div className="flex items-center justify-end flex-1 ml-4">
              <div className="hidden xl:flex items-center space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-base"
                >
                  {currentLanguage === "KR" ? "홈" : "Home"}
                </Link>

                {/* About Tunisia Dropdown */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-gray-800 hover:text-primary bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent font-semibold text-base p-0 h-auto">
                        {currentLanguage === "KR" ? "튀니지에 대해" : "About Tunisia"}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-56 p-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-tunisia"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "개요" : "Overview"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-tunisia/culture"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "문화" : "Culture"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-tunisia/cities"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "도시들" : "Cities"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-tunisia/regions"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "지역" : "Regions"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/about-tunisia/weather"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "날씨" : "Weather"}
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Travel Information Dropdown */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-gray-800 hover:text-primary bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent focus:bg-transparent font-semibold text-base p-0 h-auto">
                        {currentLanguage === "KR" ? "여행 정보" : "Travel Information"}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-56 p-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/travel-information"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "개요" : "Overview"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/travel-information/itinerary"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "여행 일정" : "Itinerary"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/travel-information/activities"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "활동" : "Activities"}
                            </Link>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/travel-information/tips"
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-orange-50 rounded-lg font-medium transition-colors"
                            >
                              {currentLanguage === "KR" ? "여행 팁" : "Travel Tips"}
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                <Link 
                  to="/blog" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-base"
                >
                  {currentLanguage === "KR" ? "블로그" : "Blog"}
                </Link>

                <Link 
                  to="/company-information" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-base"
                >
                  {currentLanguage === "KR" ? "아틀란티스에 대해" : "About Atlantis"}
                </Link>
              </div>

              {/* Compact navigation for lg screens - Show all items directly */}
              <div className="hidden lg:flex xl:hidden items-center space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-sm"
                >
                  {currentLanguage === "KR" ? "홈" : "Home"}
                </Link>

                <Link 
                  to="/about-tunisia" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-sm"
                >
                  {currentLanguage === "KR" ? "튀니지" : "Tunisia"}
                </Link>

                <Link 
                  to="/travel-information" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-sm"
                >
                  {currentLanguage === "KR" ? "여행" : "Travel"}
                </Link>

                <Link 
                  to="/blog" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-sm"
                >
                  {currentLanguage === "KR" ? "블로그" : "Blog"}
                </Link>

                <Link 
                  to="/company-information" 
                  className="text-gray-800 hover:text-primary transition-colors font-semibold text-sm"
                >
                  {currentLanguage === "KR" ? "회사" : "Atlantis"}
                </Link>
              </div>

              {/* Actions - Fixed spacing */}
              <div className="flex items-center space-x-6 ml-6">
                <Link 
                  to="/start-my-trip" 
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base"
                >
                  <Sparkles className="h-5 w-5" />
                  {currentLanguage === "KR" ? "여행 시작하기" : "Start My Trip"}
                </Link>

                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
