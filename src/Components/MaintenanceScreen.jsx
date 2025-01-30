'use client';
import React from 'react';
import Lottie from 'lottie-react';
import maintenanceAnimation from '../../public/assets/website-maintenance.json';
import { useRouter } from 'next/navigation';

const MaintenanceScreen = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
        {/* Lottie Animation */}
        <div className="w-full max-w-xl">
          <Lottie 
            animationData={maintenanceAnimation} 
            loop={true}
            className="w-full h-auto"
          />
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          {/* Text Content */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-auralblue font-outfit">
              We're Upgrading!
            </h1>
            <p className="text-xl text-gray-600 font-poppins max-w-lg">
              We are working hard on adding exciting new features to enhance your experience.
            </p>
            <div className="flex flex-col gap-2 text-gray-500 font-poppins">
              <p>🚀 New features coming soon</p>
              <p>⚡ Performance improvements</p>
              <p>✨ Enhanced user experience</p>
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
              <span className="text-sm text-gray-600 font-poppins">
                We'll be back shortly
              </span>
            </div>
          </div>

          {/* Go to Home Button */}
          <button 
            onClick={handleGoHome} 
            className="mt-6 px-4 py-2 bg-auralblue text-white rounded-full hover:bg-blue-600 transition duration-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen; 