'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaShippingFast, FaBox, FaHeadset, FaShieldAlt } from 'react-icons/fa';

const ShippingBanner = () => {
  const benefits = [
    {
      icon: <FaShippingFast className="text-2xl" />,
      title: "Free Delivery",
      description: "On your First Order"
    },
    {
      icon: <FaBox className="text-2xl" />,
      title: "Easy Returns",
      description: "30 Day Returns Policy"
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: "24/7 Support",
      description: "Expert Assistance"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Secure Payment",
      description: "100% Secure Checkout"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="bg-auralyellow py-5 px-4 md:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex items-center space-x-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-auralblue bg-opacity-10 text-auralblue">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-poppins">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ShippingBanner; 