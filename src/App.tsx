import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense } from "react";
import { TranslationProvider } from "./components/translation/TranslationProvider";
import { GlobalSEO } from "./components/seo/GlobalSEO";
import HomePage from "./pages/HomePage";
import BlogPage from "./pages/BlogPage";
import AboutTunisiaPage from "./pages/AboutTunisiaPage";
import TravelInformationPage from "./pages/TravelInformationPage";
import ArticlePage from "./pages/ArticlePage";
import NotFoundPage from "./pages/NotFoundPage";
import StartMyTripPage from "./pages/StartMyTripPage";
import AuthPage from "./pages/AuthPage";

// Lazy load non-critical pages to reduce initial bundle size
import { 
  LazyAtlantisPage,
  LazyMigrationPage,
  LazyAdminDashboardPage,
  LazyAdminBlogPage,
  LazyAdminTripPage,
  LazyAdminContactsPage,
  LazyAdminSEOPage,
  LazyAdminMediaPage,
  optimizeRouteTransition
} from "./utils/routeOptimization";

import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProtectedRoute } from "./components/admin/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoadingIndicator } from "./components/ui/LoadingIndicator";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Optimized loading fallback component
const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingIndicator size="lg" message="Loading page..." />
  </div>
);

// Route optimization wrapper
const RouteOptimizer = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  useEffect(() => {
    optimizeRouteTransition(location.pathname);
  }, [location.pathname]);
  
  return <>{children}</>;
};

function App() {
  // Log every time the App renders to help with debugging
  console.log("App rendering at:", new Date().toISOString(), "Path:", window.location.pathname);
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <TranslationProvider>
              <RouteOptimizer>
                {/* Global SEO optimization across all pages */}
                <GlobalSEO />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    {/* Critical Routes - SEO-friendly URLs */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/popular" element={<HomePage />} />
                    <Route path="/food" element={<BlogPage />} />
                    <Route path="/hotels" element={<LazyAtlantisPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/about-tunisia" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/culture" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/cities" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/regions" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/weather" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/languages" element={<AboutTunisiaPage />} />
                    <Route path="/about-tunisia/religions" element={<AboutTunisiaPage />} />
                    <Route path="/travel-information" element={<TravelInformationPage />} />
                    <Route path="/travel-information/activities" element={<TravelInformationPage />} />
                    <Route path="/travel-information/itinerary" element={<TravelInformationPage />} />
                    <Route path="/travel-information/tips" element={<TravelInformationPage />} />
                    <Route path="/blog/:slug" element={<ArticlePage />} />
                    <Route path="/start-my-trip" element={<StartMyTripPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Legacy redirects for backward compatibility */}
                    <Route path="/about" element={<AboutTunisiaPage />} />
                    <Route path="/travel" element={<TravelInformationPage />} />
                    <Route path="/blog/article/:id" element={<ArticlePage />} />
                    
                    {/* Non-Critical Routes - Lazy loaded */}
                    <Route path="/company-information" element={<LazyAtlantisPage />} />
                    <Route path="/atlantis" element={<LazyAtlantisPage />} />
                    <Route path="/migrate-images" element={<LazyMigrationPage />} />
                    
                    {/* Admin Routes - Lazy loaded and protected */}
                    <Route path="/admin" element={
                      <AdminProtectedRoute>
                        <LazyAdminDashboardPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/blog-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminBlogPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/trip-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminTripPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/contact-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminContactsPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/seo-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminSEOPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/media-management" element={
                      <AdminProtectedRoute>
                        <LazyAdminMediaPage />
                      </AdminProtectedRoute>
                    } />
                    
                    {/* Legacy admin redirects */}
                    <Route path="/admin/blog" element={
                      <AdminProtectedRoute>
                        <LazyAdminBlogPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/trip" element={
                      <AdminProtectedRoute>
                        <LazyAdminTripPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/contacts" element={
                      <AdminProtectedRoute>
                        <LazyAdminContactsPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/seo" element={
                      <AdminProtectedRoute>
                        <LazyAdminSEOPage />
                      </AdminProtectedRoute>
                    } />
                    <Route path="/admin/media" element={
                      <AdminProtectedRoute>
                        <LazyAdminMediaPage />
                      </AdminProtectedRoute>
                    } />
                    
                    {/* 404 Catch All */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </RouteOptimizer>
              <LoadingScreen />
              <Toaster />
            </TranslationProvider>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
