'use client';

import { Suspense } from 'react';

/**
 * Wraps a component that uses useSearchParams() in a Suspense boundary
 * This fixes the "useSearchParams() should be wrapped in a suspense boundary" error
 */
export default function SearchParamsProvider({ children, fallback = null }) {
  return (
    <Suspense fallback={fallback || <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>}>
      {children}
    </Suspense>
  );
} 