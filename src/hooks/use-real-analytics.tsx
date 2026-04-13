import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RealAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageBounceRate: number;
  averageSessionDuration: number;
  topPages: Array<{
    path: string;
    views: number;
    visitors: number;
  }>;
  monthlyData: Array<{
    month: string;
    pageViews: number;
    visitors: number;
  }>;
}

export const useRealAnalytics = () => {
  const [analytics, setAnalytics] = useState<RealAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Fetch analytics data from database
      const { data: analyticsData, error: analyticsError } = await supabase
        .from("analytics")
        .select("*")
        .order("date", { ascending: false });

      if (analyticsError) throw analyticsError;

      // Process the data to create summary statistics
      const processedData: RealAnalytics = {
        totalPageViews: analyticsData?.reduce((sum, item) => sum + item.page_views, 0) || 0,
        uniqueVisitors: analyticsData?.reduce((sum, item) => sum + item.visitor_count, 0) || 0,
        averageBounceRate: analyticsData?.length 
          ? analyticsData.reduce((sum, item) => sum + (item.bounce_rate || 0), 0) / analyticsData.length
          : 0,
        averageSessionDuration: analyticsData?.length
          ? analyticsData.reduce((sum, item) => sum + (item.avg_session_duration || 0), 0) / analyticsData.length
          : 0,
        topPages: analyticsData
          ?.reduce((acc: any[], item) => {
            const existing = acc.find(p => p.path === item.page_path);
            if (existing) {
              existing.views += item.page_views;
              existing.visitors += item.visitor_count;
            } else {
              acc.push({
                path: item.page_path,
                views: item.page_views,
                visitors: item.visitor_count
              });
            }
            return acc;
          }, [])
          .sort((a, b) => b.views - a.views)
          .slice(0, 10) || [],
        monthlyData: analyticsData
          ?.reduce((acc: any[], item) => {
            const month = new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            const existing = acc.find(m => m.month === month);
            if (existing) {
              existing.pageViews += item.page_views;
              existing.visitors += item.visitor_count;
            } else {
              acc.push({
                month,
                pageViews: item.page_views,
                visitors: item.visitor_count
              });
            }
            return acc;
          }, [])
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()) || []
      };

      setAnalytics(processedData);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching analytics:", err);
      
      // Fallback to basic data if no analytics exist yet
      setAnalytics({
        totalPageViews: 0,
        uniqueVisitors: 0,
        averageBounceRate: 0,
        averageSessionDuration: 0,
        topPages: [],
        monthlyData: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordPageView = async (pagePath: string) => {
    try {
      // Check if entry exists for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from("analytics")
        .select("*")
        .eq("page_path", pagePath)
        .eq("date", today)
        .single();

      if (existing) {
        // Update existing record
        await supabase
          .from("analytics")
          .update({
            page_views: existing.page_views + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);
      } else {
        // Create new record
        await supabase
          .from("analytics")
          .insert([{
            page_path: pagePath,
            page_views: 1,
            visitor_count: 1,
            date: today
          }]);
      }
    } catch (err) {
      console.error("Error recording page view:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    isLoading,
    error,
    recordPageView,
    refetch: fetchAnalytics
  };
};