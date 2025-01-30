'use client';
import React from 'react';
import { motion } from 'framer-motion';
import assets from '../../../public/assets/assets';

const categories = [
  {
    title: "Behind-the-Ear (BTE)",
    description: "Traditional hearing aids that rest behind the ear",
    image: assets.product_1
  },
  {
    title: "In-the-Ear (ITE)",
    description: "Custom-made to fit in the outer ear",
    image: assets.product_2
  },
  {
    title: "In-the-Canal (ITC)",
    description: "Custom-made to fit partly in the ear canal",
    image: assets.product_3
  },
  {
    title: "Completely-in-Canal (CIC)",
    description: "Nearly invisible devices that fit deep in the ear canal",
    image: assets.product_4
  }
];

const ProductCategories = () => {
  return (
    <div className="py-20 px-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-outfit font-bold text-auralyellow mb-4">
          Product Categories
        </h2>
        <p className="text-lg font-poppins text-gray-600">
          Explore our different types of hearing aids to find the perfect fit for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={category.image} 
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-outfit font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 font-poppins">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories; 