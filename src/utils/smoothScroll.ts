
/**
 * Smooth scroll utilities for navigation between page sections
 */

export const smoothScrollToElement = (elementId: string, offset: number = 120): boolean => {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = offset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    return true;
  }
  return false;
};

export const smoothScrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Enhanced section navigation for single-page layout
export const navigateToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 120; // Account for sticky navigation
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Update URL hash without triggering page reload
    window.history.pushState({}, '', `#${sectionId}`);
  }
};

export const addSectionIds = (): void => {
  // Add IDs to sections that might not have them
  const sections = [
    { selector: '.hero-section, [data-section="hero"]', id: 'hero' },
    { selector: '.features-section, [data-section="features"]', id: 'features' },
    { selector: '.video-section, [data-section="video"]', id: 'video' },
    { selector: '.statistics-section, [data-section="statistics"]', id: 'statistics' },
    { selector: '.weather-section, [data-section="weather"]', id: 'weather' },
    { selector: '.testimonials-section, [data-section="testimonials"]', id: 'testimonials' },
    { selector: '.overview-section, [data-section="overview"]', id: 'overview' },
    { selector: '.culture-section, [data-section="culture"]', id: 'culture' },
    { selector: '.cities-section, [data-section="cities"]', id: 'cities' },
    { selector: '.regions-section, [data-section="regions"]', id: 'regions' },
    { selector: '.languages-section, [data-section="languages"]', id: 'languages' },
    { selector: '.religions-section, [data-section="religions"]', id: 'religions' },
    { selector: '.itinerary-section, [data-section="itinerary"]', id: 'itinerary' },
    { selector: '.activities-section, [data-section="activities"]', id: 'activities' },
    { selector: '.museums-section, [data-section="museums"]', id: 'museums' },
    { selector: '.festivals-section, [data-section="festivals"]', id: 'festivals' },
    { selector: '.tips-section, [data-section="tips"]', id: 'tips' },
    { selector: '.transportation-section, [data-section="transportation"]', id: 'transportation' },
    { selector: '.team-section, [data-section="team"]', id: 'team' },
    { selector: '.partners-section, [data-section="partners"]', id: 'partners' },
    { selector: '.contact-section, [data-section="contact"]', id: 'contact' },
  ];

  sections.forEach(({ selector, id }) => {
    const element = document.querySelector(selector);
    if (element && !element.id) {
      element.id = id;
    }
  });
};

export const handleSectionNavigation = (path: string): void => {
  const [routePath, hash] = path.split('#');
  
  if (hash) {
    // For single-page layout, just scroll to section
    setTimeout(() => {
      navigateToSection(hash);
    }, 100);
  } else {
    // No hash, just scroll to top
    smoothScrollToTop();
  }
};
