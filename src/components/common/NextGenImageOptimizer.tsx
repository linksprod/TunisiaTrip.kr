import React, { useState, useEffect } from 'react';

interface NextGenImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
}

export const NextGenImage: React.FC<NextGenImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate WebP and AVIF versions
  const generateImageSources = (originalSrc: string) => {
    const lastDotIndex = originalSrc.lastIndexOf('.');
    const basePath = originalSrc.substring(0, lastDotIndex);
    const extension = originalSrc.substring(lastDotIndex);

    // For Lovable uploads, we'll create optimized versions
    if (originalSrc.includes('/lovable-uploads/')) {
      return {
        avif: `${basePath}.avif`,
        webp: `${basePath}.webp`,
        original: originalSrc
      };
    }

    return {
      avif: null,
      webp: null,
      original: originalSrc
    };
  };

  const sources = generateImageSources(src);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Preload critical images
  useEffect(() => {
    if (fetchPriority === 'high') {
      const preloadLinks = [];
      
      if (sources.avif) {
        const avifLink = document.createElement('link');
        avifLink.rel = 'preload';
        avifLink.as = 'image';
        avifLink.href = sources.avif;
        avifLink.type = 'image/avif';
        preloadLinks.push(avifLink);
      }
      
      if (sources.webp) {
        const webpLink = document.createElement('link');
        webpLink.rel = 'preload';
        webpLink.as = 'image';
        webpLink.href = sources.webp;
        webpLink.type = 'image/webp';
        preloadLinks.push(webpLink);
      }

      preloadLinks.forEach(link => document.head.appendChild(link));

      return () => {
        preloadLinks.forEach(link => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [sources.avif, sources.webp, fetchPriority]);

  const baseProps = {
    alt,
    width,
    height,
    loading,
    onLoad: handleLoad,
    onError: handleError,
    decoding: 'async' as const,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    style: { 
      contentVisibility: 'auto' as const,
      ...(hasError && { display: 'none' })
    }
  };

  // If it's a simple image without modern format support
  if (!sources.avif && !sources.webp) {
    return (
      <img
        {...baseProps}
        src={sources.original}
        fetchPriority={fetchPriority as any}
      />
    );
  }

  return (
    <picture>
      {sources.avif && (
        <source
          srcSet={sources.avif}
          type="image/avif"
          sizes={sizes}
        />
      )}
      
      {sources.webp && (
        <source
          srcSet={sources.webp}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      <img
        {...baseProps}
        src={sources.original}
        fetchPriority={fetchPriority as any}
      />
    </picture>
  );
};

// Higher-order component for automatic image optimization
export const withImageOptimization = <P extends object>(
  WrappedComponent: React.ComponentType<P & { src: string; alt: string }>
) => {
  return React.forwardRef<any, P & { src: string; alt: string }>((props, ref) => {
    const { src, alt, ...restProps } = props;
    
    return (
      <NextGenImage
        src={src}
        alt={alt}
        {...(restProps as any)}
        ref={ref}
      />
    );
  });
};

export default NextGenImage;