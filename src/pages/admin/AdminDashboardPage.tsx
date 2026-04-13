
import React from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReadingTimeChart } from "@/components/admin/charts/ReadingTimeChart";
import { PerformanceChart } from "@/components/admin/charts/PerformanceChart";
import { ResourceUsageChart } from "@/components/admin/charts/ResourceUsageChart";
import { DashboardMetricsCards } from "@/components/admin/charts/DashboardMetricsCards";
import { useBlogAnalytics } from "@/hooks/use-blog-analytics";
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics";
import { useDeviceSize } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboardPage = () => {
  const { analytics, isLoading: loadingAnalytics, error: analyticsError } = useBlogAnalytics();
  const performanceMetrics = usePerformanceMetrics();
  const { isMobile } = useDeviceSize();
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (analyticsError) {
      toast({
        title: "Error loading analytics",
        description: analyticsError.message,
        variant: "destructive"
      });
    }
  }, [analyticsError, toast]);

  // Show loading state when data isn't ready
  if (loadingAnalytics) {
    return (
      <AdminLayout>
        <div className="space-y-6 md:space-y-8">
          <AdminHeader
            title="Dashboard"
            description="Loading dashboard data..."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Calculate performance improvement rate based on industry averages
  // For a tourism website, industry average load time is around 3-4 seconds
  const industryAverage = 3500; // 3.5 seconds in ms
  const perfImprovementRate = performanceMetrics.pageLoadTime < industryAverage 
    ? Math.round(((industryAverage - performanceMetrics.pageLoadTime) / industryAverage) * 100)
    : 0; // If we're slower than average, show 0% improvement

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8 animate-fadeIn">
        <AdminHeader
          title="Dashboard"
          description={analytics.totalPosts === 0 
            ? "Real-time analytics ready - Create your first blog post to see data!" 
            : "Real-time overview of your blog's performance and analytics."
          }
        />

        {/* Top Cards with blog metrics */}
        <DashboardMetricsCards 
          totalPosts={analytics.totalPosts}
          averageReadTime={analytics.averageReadTime}
          pageLoadTime={performanceMetrics.pageLoadTime}
          postGrowthRate={analytics.postGrowthRate}
          readTimeGrowthRate={analytics.readTimeGrowthRate}
          perfImprovementRate={Math.round(perfImprovementRate)}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Reading Time Chart */}
          <ReadingTimeChart data={analytics.monthlyPostCounts} />

          {/* Performance Metrics Chart */}
          <PerformanceChart metrics={performanceMetrics} />
        </div>

        {/* Bottom Section - Single Chart */}
        <div className="grid grid-cols-1">
          {/* Resource Usage Section */}
          <ResourceUsageChart metrics={performanceMetrics} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
