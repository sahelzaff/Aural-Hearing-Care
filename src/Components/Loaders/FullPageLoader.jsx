'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * FullPageLoader component
 * 
 * A professional, branded loading screen themed around hearing and sound
 * for an audiologist clinic website. Features animated sound waves that
 * morph into an ear shape before revealing the logo.
 */
const FullPageLoader = ({ isLoading = true }) => {
  // Prevent scrolling while loader is active
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  // Sound wave data for the animation
  const generateWavePoints = (amplitude, frequency, phase, count) => {
    return Array.from({ length: count }, (_, i) => ({
      x: i * (100 / (count - 1)),
      y: 50 + amplitude * Math.sin((i * frequency * Math.PI * 2) / count + phase)
    }));
  };

  // Animation variants
  const containerVariants = {
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
        when: "afterChildren",
        duration: 0.8,
      },
    },
  };
  
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        delay: 2.2
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.4 }
    },
  };
  
  const pulseVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { 
      scale: [0.8, 1.1, 1],
      opacity: [0, 0.6, 0.2],
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse",
        duration: 2.5,
        ease: "easeInOut",
      }
    },
    exit: { opacity: 0 }
  };
  
  const earShapeVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    show: { 
      opacity: 1,
      pathLength: 1,
      transition: { 
        delay: 1.5,
        duration: 1.5, 
        ease: "easeInOut"
      }
    },
    exit: { opacity: 0, pathLength: 0 }
  };
  
  const waveVariants = {
    hidden: { opacity: 0, pathLength: 0 },
    show: { 
      opacity: [0, 1, 1, 0.7],
      pathLength: [0, 1, 1, 1],
      transition: { 
        duration: 2.5,
        times: [0, 0.4, 0.8, 1],
        ease: "easeInOut"
      }
    },
    exit: { opacity: 0, pathLength: 0 }
  };
  
  const textVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        delay: 2.4,
        duration: 0.6
      }
    },
    exit: { opacity: 0 }
  };
  
  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.8 + (i * 0.15),
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }),
    exit: { opacity: 0, scale: 0 }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="full-page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background radial gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-white via-white to-gray-50"></div>
          
          <motion.div
            className="relative flex flex-col items-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Main animation container */}
            <div className="relative w-80 h-80 mb-8">
              {/* Pulsing Circle */}
              <motion.div 
                className="absolute inset-1/4 rounded-full bg-auralblue/5"
                variants={pulseVariants}
              />
              
              {/* Sound wave animations */}
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                {/* First wave (higher frequency, blue) */}
                <motion.path
                  d="M 40,100 Q 60,60 80,100 T 120,100 T 160,100"
                  stroke="#0099cc"
                  strokeWidth="2"
                  fill="none"
                  variants={waveVariants}
                  custom={0}
                />
                
                {/* Second wave (medium frequency, mixed color) */}
                <motion.path
                  d="M 40,100 Q 65,75 80,100 T 120,100 T 160,100"
                  stroke="#7ab2cc"
                  strokeWidth="1.5"
                  fill="none"
                  variants={waveVariants}
                  custom={1}
                  transition={{ 
                    delay: 0.3,
                    duration: 2.5,
                    times: [0, 0.4, 0.8, 1],
                    ease: "easeInOut"
                  }}
                />
                
                {/* Third wave (lower frequency, yellow) */}
                <motion.path
                  d="M 40,100 Q 70,130 80,100 T 120,100 T 160,100"
                  stroke="#afcc1c"
                  strokeWidth="2"
                  fill="none"
                  variants={waveVariants}
                  custom={2}
                  transition={{ 
                    delay: 0.6,
                    duration: 2.5,
                    times: [0, 0.4, 0.8, 1],
                    ease: "easeInOut"
                  }}
                />
                
                {/* Ear shape outline */}
                <motion.path
                  d="M 100,60 C 140,60 160,90 160,120 C 160,150 140,170 120,170 C 110,170 105,165 100,160 C 95,155 90,150 85,150 C 75,150 70,160 60,160 C 50,160 45,150 45,140 C 45,110 70,60 100,60 Z"
                  stroke="#0099cc"
                  strokeWidth="2"
                  fill="none"
                  variants={earShapeVariants}
                />
                
                {/* Inner ear details */}
                <motion.path
                  d="M 100,80 C 130,85 140,100 140,120 C 140,140 130,150 115,150"
                  stroke="#afcc1c"
                  strokeWidth="1.5"
                  fill="none"
                  variants={earShapeVariants}
                  transition={{ 
                    delay: 1.7,
                    duration: 1.3, 
                    ease: "easeInOut"
                  }}
                />
                
                {/* Cochlear-inspired spiral */}
                <motion.path
                  d="M 90,120 C 95,115 100,118 98,125 C 96,132 88,132 85,125 C 82,118 86,110 95,108 C 104,106 112,112 114,122"
                  stroke="#0099cc"
                  strokeWidth="1.5"
                  fill="none"
                  variants={earShapeVariants}
                  transition={{ 
                    delay: 1.9,
                    duration: 1.1, 
                    ease: "easeInOut"
                  }}
                />
              </svg>
              
              {/* Animated frequency dots */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute rounded-full ${i % 2 === 0 ? 'bg-auralblue' : 'bg-auralyellow'}`}
                  style={{
                    top: `${100 + Math.sin(i * 0.8) * 20}px`,
                    left: `${100 + Math.cos(i * 0.8) * 25}px`,
                    width: `${6 + i}px`,
                    height: `${6 + i}px`,
                  }}
                  variants={dotVariants}
                  custom={i}
                />
              ))}
            </div>
            
            {/* Logo reveal */}
            <motion.div
              className="relative z-10 mb-6"
              variants={logoVariants}
            >
              <Image 
                src="/assets/logo.png" 
                alt="Aural Hearing Care" 
                width={220} 
                height={75} 
                priority
                className="drop-shadow-sm"
              />
            </motion.div>
            
            {/* Loading Text */}
            <motion.div
              className="flex items-center space-x-1.5"
              variants={textVariants}
            >
              <span className="text-gray-600 text-sm font-medium">Enhancing your hearing experience</span>
              <span className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-auralblue"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullPageLoader; 