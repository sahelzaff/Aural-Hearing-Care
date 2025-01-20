'use client';
import React from 'react';
import Lottie from 'lottie-react';
import maintenanceAnimation from '../../public/assets/website-maintenance.json';

const MaintenanceScreen = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        <Lottie 
          animationData={maintenanceAnimation} 
          loop={true}
        />
      </div>
      <h1 className="text-3xl font-bold text-auralblue mt-8 font-outfit">
        We're Upgrading!
      </h1>
      <p className="text-gray-600 mt-4 text-center max-w-md font-poppins">
        We are working hard on adding exciting new features to enhance your experience.
      </p>
    </div>
  );
};

export default MaintenanceScreen;