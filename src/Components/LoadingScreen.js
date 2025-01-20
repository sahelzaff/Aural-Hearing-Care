import React from 'react';
import assets from '../../public/assets/assets';

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 z-50">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <img 
          src={assets.logo_short} 
          alt="Aural Logo"
          className="w-24 h-24 object-contain z-10"
          style={{
            animation: 'scale 2s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute inset-0 border-4 border-t-auralblue border-r-transparent border-b-transparent border-l-transparent rounded-full"
          style={{
            animation: 'spin 1s linear infinite'
          }}
        ></div>
        <div 
          className="absolute inset-0 border-4 border-r-auralyellow border-t-transparent border-b-transparent border-l-transparent rounded-full"
          style={{
            animation: 'spin-slow 2s linear infinite'
          }}
        ></div>
      </div>
      <style jsx>{`
        @keyframes scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.9); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
      <div className="mt-6 text-auralblue font-outfit text-xl font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default LoadingScreen;
