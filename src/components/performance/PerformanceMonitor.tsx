import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/use-translation';
interface WebVitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}
interface PerformanceData {
  vitals: WebVitalsMetrics;
  userAgent: string;
  connection: string;
  timestamp: number;
}
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });
  const [isKoreanUser, setIsKoreanUser] = useState(false);
  const {
    currentLanguage
  } = useTranslation();
  useEffect(() => {
    setIsKoreanUser(currentLanguage === 'KR');

    // Performance Observer für Core Web Vitals
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            lcp: entry.startTime
          }));
        }
        if (entry.entryType === 'first-input') {
          setMetrics(prev => ({
            ...prev,
            fid: (entry as any).processingStart - entry.startTime
          }));
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          setMetrics(prev => ({
            ...prev,
            cls: (prev.cls || 0) + (entry as any).value
          }));
        }
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({
            ...prev,
            fcp: entry.startTime
          }));
        }
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            ttfb: navEntry.responseStart - navEntry.requestStart
          }));
        }
      }
    });

    // Observe verschiedene Metriken
    try {
      observer.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation']
      });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    // Korean market specific tracking
    if (isKoreanUser) {
      trackKoreanUserBehavior();
    }
    return () => observer.disconnect();
  }, [currentLanguage, isKoreanUser]);
  const trackKoreanUserBehavior = () => {
    // Track Korean-specific performance patterns
    const performanceData: PerformanceData = {
      vitals: metrics,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      timestamp: Date.now()
    };

    // Send to Korean analytics endpoint (würde in echtem System implementiert)
    console.log('Korean user performance data:', performanceData);
  };
  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-muted-foreground';
    const thresholds = {
      lcp: {
        good: 2500,
        needs: 4000
      },
      fid: {
        good: 100,
        needs: 300
      },
      cls: {
        good: 0.1,
        needs: 0.25
      },
      fcp: {
        good: 1800,
        needs: 3000
      },
      ttfb: {
        good: 800,
        needs: 1800
      }
    };
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-muted-foreground';
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.needs) return 'text-yellow-600';
    return 'text-red-600';
  };
  if (!isKoreanUser && process.env.NODE_ENV === 'production') {
    return null; // Nur für Korean users in production zeigen
  }
  return;
}