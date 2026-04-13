/**
 * WebP image format converter and optimizer
 */

export interface WebPImageSources {
  webp: string;
  original: string;
  sizes: string;
}

export const createWebPSources = (imageSrc: string, sizes?: number[]): WebPImageSources => {
  const defaultSizes = [320, 640, 768, 1024, 1280, 1920];
  const imageSizes = sizes || defaultSizes;
  
  // Extract file extension and base path
  const lastDotIndex = imageSrc.lastIndexOf('.');
  const basePath = imageSrc.substring(0, lastDotIndex);
  const extension = imageSrc.substring(lastDotIndex);
  
  // Create WebP srcset
  const webpSrcSet = imageSizes
    .map(size => `${basePath}-${size}w.webp ${size}w`)
    .join(', ');
  
  // Create original format srcset
  const originalSrcSet = imageSizes
    .map(size => `${basePath}-${size}w${extension} ${size}w`)
    .join(', ');
  
  // Create sizes attribute
  const sizesAttr = imageSizes
    .map((size, index) => {
      if (index === imageSizes.length - 1) return `${size}px`;
      return `(max-width: ${size}px) ${size}px`;
    })
    .join(', ');
  
  return {
    webp: webpSrcSet,
    original: originalSrcSet,
    sizes: sizesAttr
  };
};

export const generatePictureElement = (
  src: string, 
  alt: string, 
  className?: string,
  sizes?: number[]
): string => {
  const sources = createWebPSources(src, sizes);
  
  return `
    <picture>
      <source 
        srcset="${sources.webp}" 
        sizes="${sources.sizes}" 
        type="image/webp"
      />
      <source 
        srcset="${sources.original}" 
        sizes="${sources.sizes}"
      />
      <img 
        src="${src}" 
        alt="${alt}"
        ${className ? `class="${className}"` : ''}
        loading="lazy"
        decoding="async"
        style="content-visibility: auto;"
      />
    </picture>
  `;
};

export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    // Preload WebP version if available
    const webpUrl = url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = webpUrl;
    preloadLink.type = 'image/webp';
    preloadLink.fetchPriority = 'high';
    
    // Fallback to original format
    const fallbackLink = document.createElement('link');
    fallbackLink.rel = 'preload';
    fallbackLink.as = 'image';
    fallbackLink.href = url;
    fallbackLink.fetchPriority = 'high';
    
    document.head.appendChild(preloadLink);
    document.head.appendChild(fallbackLink);
  });
};