
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { handleSectionNavigation } from "@/utils/smoothScroll";

// Define tag type for better type safety
export interface Tag {
  name: string;
  active: boolean;
  path: string;
}

// Updated tag data with all specific section targets
export const DEFAULT_TAGS: Tag[] = [
  { name: "Cities", active: false, path: "/about-tunisia#cities" },
  { name: "Weather", active: false, path: "/about-tunisia#weather" },
  { name: "Languages", active: false, path: "/about-tunisia#languages" },
  { name: "Religions", active: false, path: "/about-tunisia#religions" },
  { name: "Food", active: false, path: "/food" },
  { name: "Activities", active: false, path: "/travel-information?tab=activities" },
  { name: "Museums", active: false, path: "/travel-information?tab=activities&section=museums" },
  { name: "Festivals", active: false, path: "/travel-information?tab=activities&section=festivals" },
  { name: "Itinerary", active: false, path: "/travel-information/itinerary" },
  { name: "Transportation", active: false, path: "/travel-information?tab=departure&section=transportation" },
  { name: "Tips", active: false, path: "/travel-information?tab=departure" },
  { name: "Hotels", active: false, path: "/atlantis?section=hotels-services" },
  { name: "Team", active: false, path: "/atlantis?section=team" },
  { name: "Partners", active: false, path: "/atlantis?section=partners" },
  { name: "Contact", active: false, path: "/atlantis?section=contact" },
  { name: "Blog", active: false, path: "/blog" },
];

export const useTags = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Check if current location matches any tag path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    const currentSearch = location.search;
    
    console.log('Current location:', { currentPath, currentHash, currentSearch });
    
    // Check for section-based tags (About Tunisia sections)
    if (currentPath === "/about-tunisia") {
      if (currentHash === "#cities") {
        setActiveTag("Cities");
        return;
      }
      if (currentHash === "#weather") {
        setActiveTag("Weather");
        return;
      }
      if (currentHash === "#languages") {
        setActiveTag("Languages");
        return;
      }
      if (currentHash === "#religions") {
        setActiveTag("Religions");
        return;
      }
      // If on about-tunisia but no specific section, clear active tag
      setActiveTag(null);
      return;
    }
    
    // Check for travel information tabs and sections
    if (currentPath === "/travel-information") {
      if (currentSearch.includes("tab=activities")) {
        if (currentSearch.includes("section=museums")) {
          setActiveTag("Museums");
          return;
        }
        if (currentSearch.includes("section=festivals")) {
          setActiveTag("Festivals");
          return;
        }
        setActiveTag("Activities");
        return;
      }
      if (currentSearch.includes("tab=departure")) {
        if (currentSearch.includes("section=transportation")) {
          setActiveTag("Transportation");
          return;
        }
        setActiveTag("Tips");
        return;
      }
    }
    
    // Check for travel information itinerary
    if (currentPath === "/travel-information/itinerary") {
      setActiveTag("Itinerary");
      return;
    }
    
    // Check for Atlantis sections
    if (currentPath === "/atlantis") {
      if (currentSearch.includes("section=hotels-services")) {
        setActiveTag("Hotels");
        return;
      }
      if (currentSearch.includes("section=team")) {
        setActiveTag("Team");
        return;
      }
      if (currentSearch.includes("section=partners")) {
        setActiveTag("Partners");
        return;
      }
      if (currentSearch.includes("section=contact")) {
        setActiveTag("Contact");
        return;
      }
    }
    
    // Check for direct path matches
    const matchingTag = DEFAULT_TAGS.find(tag => {
      const tagPath = tag.path.split('#')[0].split('?')[0];
      return tagPath === currentPath;
    });
    
    if (matchingTag) {
      setActiveTag(matchingTag.name);
    } else {
      setActiveTag(null);
    }
  }, [location]);

  const handleTagClick = useCallback((tagName: string, path: string) => {
    console.log('Tag clicked:', tagName, path);
    setActiveTag(tagName);
    
    // Parse the path to determine navigation strategy
    const currentPath = location.pathname;
    
    // Special handling for About Tunisia section tags
    const aboutTunisiaSections = ["Cities", "Weather", "Languages", "Religions"];
    if (aboutTunisiaSections.includes(tagName)) {
      if (currentPath === "/about-tunisia") {
        // Already on About Tunisia page, just scroll to section
        handleSectionNavigation(path);
        // Update URL hash without navigation
        window.history.pushState({}, '', path);
      } else {
        // Navigate to About Tunisia page with hash
        navigate(path);
        // Handle scrolling after navigation
        setTimeout(() => {
          handleSectionNavigation(path);
        }, 300);
      }
      return;
    }
    
    // Special handling for Travel Information sections with complex URLs
    const travelInfoSections = ["Activities", "Museums", "Festivals", "Transportation", "Tips"];
    if (travelInfoSections.includes(tagName) && path.includes("/travel-information")) {
      navigate(path);
      // Handle scrolling after navigation for nested sections
      setTimeout(() => {
        if (path.includes("section=")) {
          // Extract section name for scrolling
          const sectionMatch = path.match(/section=([^&]+)/);
          if (sectionMatch) {
            const sectionId = sectionMatch[1];
            handleSectionNavigation(`#${sectionId}`);
          }
        }
      }, 300);
      return;
    }
    
    // Special handling for Atlantis sections
    const atlantisSections = ["Hotels", "Team", "Partners", "Contact"];
    if (atlantisSections.includes(tagName) && path.includes("/atlantis")) {
      navigate(path);
      // Handle scrolling after navigation for Atlantis sections
      setTimeout(() => {
        if (path.includes("section=")) {
          // For Atlantis sections, scroll to top and let the page handle section display
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 300);
      return;
    }
    
    // Handle other navigation cases
    navigate(path);
    
    // Handle scrolling after navigation if there's a hash or section parameter
    if (path.includes('#') || path.includes('section=')) {
      setTimeout(() => {
        if (path.includes('#')) {
          handleSectionNavigation(path);
        } else if (path.includes('section=')) {
          // For other sections, scroll to top and let the page handle section display
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 300);
    }
  }, [location.pathname, navigate]);

  return {
    tags: DEFAULT_TAGS,
    activeTag,
    handleTagClick
  };
};
