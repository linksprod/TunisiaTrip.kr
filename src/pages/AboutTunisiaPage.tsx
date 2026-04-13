
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutTunisiaHero } from "@/components/about/AboutTunisiaHero";
import { AboutTunisiaTabs } from "@/components/about/AboutTunisiaTabs";
import { AboutTunisiaBreadcrumb } from "@/components/about/AboutTunisiaBreadcrumb";
import { AboutTunisiaPageHeader } from "@/components/about/AboutTunisiaPageHeader";
import { OverviewContent } from "@/components/about/content/OverviewContent";
import { CountryLocationContent } from "@/components/about/CountryLocationContent";
import { CultureContent } from "@/components/about/content/CultureContent";
import { RegionsContent } from "@/components/about/content/RegionsContent";
import { TunisianWeatherContent } from "@/components/about/TunisianWeatherContent";
import { LinguisticDiversityContent } from "@/components/about/LinguisticDiversityContent";
import { ReligionsContent } from "@/components/about/ReligionsContent";
import { CitiesContent } from "@/components/about/content/CitiesContent";
import { Button } from "@/components/ui/button";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

const AboutTunisiaPage = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { currentLanguage } = useTranslation();

  // Intersection observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            console.log('Section in view:', entry.target.id, 'ratio:', entry.intersectionRatio);
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: [0.3, 0.5, 0.7], 
        rootMargin: "-100px 0px -100px 0px" 
      }
    );

    const sections = document.querySelectorAll('[data-section]');
    console.log('Observing sections:', Array.from(sections).map(s => s.id));
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Show back to top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionClick = (sectionId: string) => {
    console.log('Page - Section click handler called for:', sectionId);
    setActiveSection(sectionId);
  };

  return (
    <MainLayout showTagBar={true}>
      <AboutTunisiaHero />
      
      <div className="w-full bg-white">
        <AboutTunisiaTabs 
          activeSection={activeSection} 
          onSectionClick={handleSectionClick}
        />
        
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          <AboutTunisiaBreadcrumb />
          <AboutTunisiaPageHeader activeSection={activeSection} />
          
          {/* Overview Section */}
          <section id="overview" data-section="overview" className="pt-24 mb-12 md:mb-16">
            <div className="space-y-8">
              <OverviewContent />
              <CitiesContent />
            </div>
          </section>

          {/* Location Section */}
          <section id="location" data-section="location" className="pt-24 mb-12 md:mb-16">
            <CountryLocationContent />
          </section>

          {/* Culture Section */}
          <section id="culture" data-section="culture" className="pt-24 mb-12 md:mb-16">
            <CultureContent />
          </section>

          {/* Regions Section */}
          <section id="regions" data-section="regions" className="pt-24 mb-12 md:mb-16">
            <RegionsContent />
          </section>

          {/* Weather Section */}
          <section id="weather" data-section="weather" className="pt-24 mb-12 md:mb-16">
            <TunisianWeatherContent />
          </section>

          {/* Languages Section */}
          <section id="languages" data-section="languages" className="pt-24 mb-12 md:mb-16">
            <LinguisticDiversityContent />
          </section>

          {/* Religions Section */}
          <section id="religions" data-section="religions" className="pt-24 mb-12 md:mb-16">
            <ReligionsContent />
          </section>

          {/* Final Navigation Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-16 pt-8 border-t border-gray-200">
            <Button variant="outline" className="text-blue-500 border-blue-500 gap-2 w-full sm:w-auto" asChild>
              <Link to="/">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
                </svg>
                <TranslateText text="Back to Home" language={currentLanguage} />
              </Link>
            </Button>
            
            <Button variant="outline" className="text-blue-500 border-blue-500 gap-2 w-full sm:w-auto" asChild>
              <Link to="/travel">
                <TranslateText text="Explore Travel Information" language={currentLanguage} />
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <Button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300 hover:scale-110"
            size="icon"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        )}
      </div>
    </MainLayout>
  );
};

export default AboutTunisiaPage;
