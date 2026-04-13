
import React, { useLayoutEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { TunisiaFooter } from "@/components/TunisiaFooter";
import Chat from "@/components/chat/Chat";
import { TagBar } from "@/components/TagBar";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
  showTagBar?: boolean;
}

export function MainLayout({ children, showTagBar = true }: MainLayoutProps) {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height);
      document.documentElement.style.scrollPaddingTop = `${height}px`;
    }

    return () => {
      document.documentElement.style.scrollPaddingTop = '';
    };
  }, [showTagBar, location.pathname, children]);

  useLayoutEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          document.documentElement.style.scrollBehavior = 'smooth';
          element.scrollIntoView({ 
            block: 'start',
            behavior: 'smooth'
          });
        }
      });
    } else {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
      });
    }
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [location.pathname, location.hash, headerHeight]);

  return (
    <div className="flex min-h-screen flex-col w-full">
      <ErrorBoundary>
        <header ref={headerRef} className="fixed top-0 left-0 right-0 z-[60] w-full bg-white shadow-sm">
          {/* Mobile Navbar (visible on mobile only) */}
          <div className="md:hidden">
            <MobileNavbar />
          </div>
          {/* Desktop/Tablet Navbar (visible from md and up) */}
          <div className="hidden md:block">
            <Navbar />
          </div>
          {/* TagBar is shown below Navbar on all devices (unless hidden via showTagBar) */}
          {showTagBar && <TagBar />}
        </header>
        
        <div style={{ paddingTop: `${headerHeight}px` }} className="w-full flex flex-col flex-1">
          <main className="flex-1 w-full">
            <div className="page-transition w-full">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
          <TunisiaFooter />
          <Chat />
        </div>
      </ErrorBoundary>
    </div>
  );
}

