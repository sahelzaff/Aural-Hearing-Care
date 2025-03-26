'use client';

import { useState, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { store } from '../store/store';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';

// Dynamically import loader components
const FullPageLoader = dynamic(() => import('../Components/Loaders/FullPageLoader'), { ssr: false });
const MinimalLoader = dynamic(() => import('../Components/Loaders/MinimalLoader'), { ssr: false });

// Dynamically import global components with no SSR
const TopbarBelow = dynamic(() => import('../Components/Global Components/TopbarBelow'), { ssr: false });
const ClientNavbar = dynamic(() => import('../Components/Global Components/ClientNavbar'), { ssr: false });
const Footer = dynamic(() => import('../Components/Global Components/Footer'), { ssr: false });

export function Providers({ children }) {
  // State for initial page load
  const [initialLoading, setInitialLoading] = useState(true);
  
  // State for page transitions
  const [navigationLoading, setNavigationLoading] = useState(false);
  
  // Track URL changes to show loader during navigation
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathRef = useRef(pathname);
  const loadingStartTimeRef = useRef(null);
  const minLoaderDisplayTime = 400; // Minimum time to show loader (ms)
  
  // Handle initial page load
  useEffect(() => {
    // Simulating resources loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // Show initial loader for 2 seconds
    
    return () => clearTimeout(timer);
  }, []);
  
  // Detect when components have actually mounted/updated
  useEffect(() => {
    // Only run this effect once the app has initially loaded
    if (initialLoading) return;
    
    // Check if this is a navigation (not initial load)
    if (prevPathRef.current !== pathname) {
      // Start the loader with a small delay to avoid flash for instant loads
      const startLoadingTimer = setTimeout(() => {
        loadingStartTimeRef.current = Date.now();
        setNavigationLoading(true);
      }, 50);
      
      // Update the previous path reference
      prevPathRef.current = pathname;
      
      // Clean up
      return () => clearTimeout(startLoadingTimer);
    }
  }, [pathname, initialLoading]);
  
  // Setup DOM mutation observer to detect when content has loaded
  useEffect(() => {
    if (initialLoading || !navigationLoading) return;
    
    // Start monitoring DOM changes to detect when content has loaded
    const observer = new MutationObserver((mutations) => {
      // If we detect significant DOM changes, the page has likely loaded
      if (mutations.length > 0) {
        const loadDuration = Date.now() - (loadingStartTimeRef.current || 0);
        
        // Ensure loader is displayed for at least the minimum time
        const remainingTime = Math.max(0, minLoaderDisplayTime - loadDuration);
        
        setTimeout(() => {
          setNavigationLoading(false);
        }, remainingTime);
        
        // Disconnect observer once we've detected loading completion
        observer.disconnect();
      }
    });
    
    // Start observing the main content area
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Fallback timer (max loading time)
    const fallbackTimer = setTimeout(() => {
      setNavigationLoading(false);
      observer.disconnect();
    }, 3000); // Max loading time
    
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [navigationLoading, initialLoading]);

  return (
    <SessionProvider>
      <Provider store={store}>
        <Toaster position="top-center" />
        
        {/* Initial full page loader */}
        <FullPageLoader isLoading={initialLoading} />
        
        {/* Navigation transition loader - intelligently detects actual loading time */}
        <MinimalLoader 
          isLoading={navigationLoading && !initialLoading} 
          fixed={true} 
          size="md" 
        />
        
        {/* Only render content after initial load completes */}
        {!initialLoading && (
          <>
            {/* Global navigation components */}
            <TopbarBelow />
            <ClientNavbar />
            
            {/* Main content */}
            {children}
            
            {/* Global footer */}
            <Footer />
          </>
        )}
      </Provider>
    </SessionProvider>
  );
}
