
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { TravelHero } from "@/components/travel/TravelHero";
import { TravelContent } from "@/components/travel/TravelContent";
import { useLocation, useSearchParams } from "react-router-dom";

const TravelInformationPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("itinerary");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    setPageReady(true);
    
    const section = searchParams.get('section');
    const tab = searchParams.get('tab');
    const modeIndex = searchParams.get('mode');
    
    if (tab && ['itinerary', 'departure', 'activities', 'hotels', 'transportation'].includes(tab)) {
      setActiveTab(tab);
    } else {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['itinerary', 'departure', 'activities', 'hotels', 'transportation'].includes(hash)) {
        setActiveTab(hash);
      }
    }

    if (section) {
      setTimeout(() => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });

          if (section === 'transportation' && modeIndex) {
            const transportModeIndex = parseInt(modeIndex);
            if (!isNaN(transportModeIndex) && transportModeIndex >= 1 && transportModeIndex <= 6) {
              setTimeout(() => {
                const transportModeButtons = document.querySelectorAll('.grid.grid-cols-3.sm\\:grid-cols-6 > div');
                if (transportModeButtons && transportModeButtons.length >= transportModeIndex) {
                  (transportModeButtons[transportModeIndex - 1] as HTMLElement).click();
                }
              }, 500);
            }
          }
        } else {
          const headings = document.querySelectorAll('h2, h3');
          for (const heading of headings) {
            if (heading.textContent?.toLowerCase().includes(section.toLowerCase())) {
              heading.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
        }
      }, 800);
    }

    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
        
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('tab', event.detail.tab);
        if (event.detail.section) {
          newParams.set('section', event.detail.section);
        }
        if (event.detail.message) {
          newParams.set('mode', event.detail.message);
        }
        window.history.replaceState(null, '', `${location.pathname}?${newParams.toString()}`);
      }
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);

    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, [searchParams, location.pathname]);

  return (
    <MainLayout showTagBar={true}>
      <div className={`transition-opacity duration-200 ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
        <TravelHero />
        <TravelContent initialTab={activeTab} />
      </div>
    </MainLayout>
  );
};

export default TravelInformationPage;
