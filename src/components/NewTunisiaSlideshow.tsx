
import React, { useState, useEffect } from "react";
import { preloadImages } from "@/utils/imageUtils";
import { tunisiaSlides } from "@/data/slideshowData";
import { SlideContent } from "@/components/slideshow/SlideContent";
import { SlideIndicators } from "@/components/slideshow/SlideIndicators";
import { SlideNavigation } from "@/components/slideshow/SlideNavigation";

export function NewTunisiaSlideshow(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all slideshow images with priority for first two
  useEffect(() => {
    // Preload first two slides with high priority
    const highPriorityImages = tunisiaSlides.slice(0, 2).map(slide => slide.src);
    preloadImages(highPriorityImages, { 
      priority: 'high',
      onComplete: () => {
        setImagesLoaded(true);
        console.log("High priority slideshow images preloaded successfully");
        
        // Then load the rest in the background
        const remainingImages = tunisiaSlides.slice(2).map(slide => slide.src);
        preloadImages(remainingImages, { 
          onComplete: () => {
            console.log("All slideshow images preloaded successfully");
          }
        });
      }
    });
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % tunisiaSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % tunisiaSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + tunisiaSlides.length) % tunisiaSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full relative">
      {/* Main slideshow container */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl">
        {!imagesLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="text-gray-400 text-xl">Loading images...</div>
          </div>
        ) : (
          tunisiaSlides.map((slide, index) => (
            <SlideContent 
              key={index} 
              slide={slide} 
              isActive={currentSlide === index} 
              priority={index < 2} // Set priority for first two slides
            />
          ))
        )}
        
        {/* Navigation buttons */}
        <SlideNavigation 
          prevSlide={prevSlide} 
          nextSlide={nextSlide} 
        />
        
        {/* Slide indicators - hidden on mobile */}
        <SlideIndicators 
          totalSlides={tunisiaSlides.length} 
          currentSlide={currentSlide} 
          goToSlide={goToSlide} 
        />
      </div>
    </div>
  );
}
