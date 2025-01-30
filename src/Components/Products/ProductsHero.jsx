'use client';
import React from 'react';
import assets from '../../../public/assets/assets';

const ProductsHero = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${assets.products_hero})`,
          filter: 'brightness(1)'
        }}
      />
      {/* <div className="w-full mx-auto relative z-10 h-full flex flex-col justify-center px-20">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-outfit font-bold text-white mb-4">
            Hearing Aid Products
          </h1>
          <p className="text-xl font-poppins text-white">
            Explore our wide range of hearing aids and accessories. Find the perfect solution 
            for your hearing needs with our advanced technology products.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default ProductsHero; 