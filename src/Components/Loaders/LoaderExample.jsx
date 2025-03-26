'use client';

import React, { useState } from 'react';
import { FullPageLoader, MinimalLoader } from './index';

/**
 * LoaderExample component
 * 
 * A demonstration component to showcase both loader types
 * with controls to toggle their visibility
 */
const LoaderExample = () => {
  const [showFullLoader, setShowFullLoader] = useState(false);
  const [showMinimalLoader, setShowMinimalLoader] = useState(false);
  const [minimalSize, setMinimalSize] = useState('md');
  const [isMinimalFixed, setIsMinimalFixed] = useState(false);
  
  // Toggle full page loader with auto-close after 5 seconds
  const toggleFullLoader = () => {
    setShowFullLoader(true);
    setTimeout(() => {
      setShowFullLoader(false);
    }, 5000);
  };
  
  // Toggle minimal loader with auto-close after 3 seconds
  const toggleMinimalLoader = () => {
    setShowMinimalLoader(true);
    setTimeout(() => {
      setShowMinimalLoader(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Loader Components</h1>
      
      {/* Full Page Loader Section */}
      <div className="mb-12 p-6 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Full Page Loader</h2>
        <p className="text-gray-600 mb-6">
          This loader is designed for initial page loads. It prevents interaction with the page
          while content is loading and features a professional animation with the full logo.
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={toggleFullLoader}
            className="px-6 py-3 bg-auralblue text-white rounded-lg hover:bg-auralblue/90 transition-colors"
          >
            Show Full Page Loader (5s)
          </button>
        </div>
        
        <FullPageLoader isLoading={showFullLoader} />
      </div>
      
      {/* Minimal Loader Section */}
      <div className="p-6 border rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Minimal Loader</h2>
        <p className="text-gray-600 mb-6">
          This compact loader is perfect for page transitions, form submissions, 
          and other lighter loading scenarios. It uses the short logo with a minimalist design.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Size:</span>
            <select
              value={minimalSize}
              onChange={(e) => setMinimalSize(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMinimalFixed}
                onChange={() => setIsMinimalFixed(!isMinimalFixed)}
                className="sr-only"
              />
              <div className={`relative w-10 h-5 transition-colors duration-200 ease-linear rounded-full ${isMinimalFixed ? 'bg-auralblue' : 'bg-gray-300'}`}>
                <div className={`absolute left-0.5 top-0.5 w-4 h-4 transition-transform duration-200 ease-linear transform bg-white rounded-full ${isMinimalFixed ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-2 text-gray-700">Fixed Position (fullscreen)</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={toggleMinimalLoader}
            className="px-6 py-3 bg-auralyellow text-white rounded-lg hover:bg-auralyellow/90 transition-colors"
          >
            Show Minimal Loader (3s)
          </button>
        </div>
        
        <div className="mt-8 relative h-40 border rounded-lg flex items-center justify-center bg-gray-50">
          {!isMinimalFixed && (
            <p className="text-gray-400 absolute">Loader will appear here if not fixed position</p>
          )}
          <MinimalLoader 
            isLoading={showMinimalLoader} 
            size={minimalSize} 
            fixed={isMinimalFixed} 
          />
        </div>
      </div>
    </div>
  );
};

export default LoaderExample; 