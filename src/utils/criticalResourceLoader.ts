/**
 * Critical resource loader for eliminating render-blocking resources
 */

export const loadCriticalCSS = () => {
  // Inline critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical CSS for LCP optimization */
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero-image {
      width: 100%;
      height: auto;
      object-fit: cover;
      content-visibility: auto;
    }
    
    /* Critical navigation styles */
    .nav-header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: hsl(var(--background));
      border-bottom: 1px solid hsl(var(--border));
    }
  `;
  
  // Create style element for critical CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = criticalCSS;
  document.head.insertBefore(styleElement, document.head.firstChild);
};

export const deferNonCriticalCSS = () => {
  // Find non-critical stylesheets and defer them
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.includes('critical')) {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'");
    }
  });
};

export const preloadWebFonts = () => {
  // Preload important web fonts
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];
  
  fonts.forEach(fontUrl => {
    const existingPreload = document.querySelector(`link[rel="preload"][href="${fontUrl}"]`);
    if (!existingPreload) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = fontUrl;
      preloadLink.as = 'style';
      preloadLink.crossOrigin = 'anonymous';
      document.head.appendChild(preloadLink);
    }
  });
};

export const initializeCriticalResources = () => {
  // Load critical resources in order of importance
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadCriticalCSS();
      preloadWebFonts();
      // Defer non-critical CSS after critical content is loaded
      setTimeout(deferNonCriticalCSS, 100);
    });
  } else {
    loadCriticalCSS();
    preloadWebFonts();
    setTimeout(deferNonCriticalCSS, 100);
  }
};