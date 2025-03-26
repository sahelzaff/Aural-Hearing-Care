'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * MinimalLoader component
 * 
 * A compact, unobtrusive loading indicator for page transitions and smaller loading operations
 * Features the short version of the Aural Hearing Care logo
 */
const MinimalLoader = ({ isLoading = false, size = 'md', fixed = false }) => {
  // Size variations
  const sizes = {
    sm: {
      container: 'w-20 h-20',
      logo: { width: 40, height: 40 },
      spinnerSize: 'w-16 h-16',
      spinnerBorder: 'border-2'
    },
    md: {
      container: 'w-28 h-28', 
      logo: { width: 50, height: 50 },
      spinnerSize: 'w-24 h-24',
      spinnerBorder: 'border-2'
    },
    lg: {
      container: 'w-36 h-36',
      logo: { width: 70, height: 70 },
      spinnerSize: 'w-32 h-32',
      spinnerBorder: 'border-3'
    }
  };
  
  const selectedSize = sizes[size] || sizes.md;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };
  
  const loaderVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="minimal-loader-overlay"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`
            ${fixed ? 'fixed inset-0 backdrop-blur-[2px] bg-transparent z-50' : 'relative z-20'} 
            flex items-center justify-center
          `}
        >
          {/* Semi-transparent overlay (only when fixed) */}
          {fixed && (
            <motion.div 
              className="absolute inset-0 bg-gray-900/10 dark:bg-gray-900/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
          
          {/* Loader container */}
          <motion.div
            variants={loaderVariants}
            className={`relative ${selectedSize.container} flex items-center justify-center z-10`}
          >
            {/* Glass-like backdrop */}
            <motion.div 
              className="absolute inset-0 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Spinning Border */}
            <motion.div 
              className={`absolute ${selectedSize.spinnerSize} ${selectedSize.spinnerBorder} border-t-auralblue border-r-auralblue/30 border-b-auralyellow border-l-auralyellow/30 rounded-full shadow-lg`}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop"
              }}
            />
            
            {/* Logo */}
            <div className="relative z-10">
              <Image 
                src="/assets/logo_short.png" 
                alt="Aural" 
                width={selectedSize.logo.width} 
                height={selectedSize.logo.height}
                priority
                className="drop-shadow-sm"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinimalLoader; 