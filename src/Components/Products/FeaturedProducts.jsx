'use client';
import React from 'react';
import ProductSlider from '../Homepage/Product_Slider';

const FeaturedProducts = () => {
  return (
    <div className="bg-gray-50 py-20 px-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-outfit font-bold text-auralyellow mb-4">
          Featured Products
        </h2>
        <p className="text-lg font-poppins text-gray-600">
          Our most popular hearing solutions
        </p>
      </div>
      
      <ProductSlider />
    </div>
  );
};

export default FeaturedProducts; 