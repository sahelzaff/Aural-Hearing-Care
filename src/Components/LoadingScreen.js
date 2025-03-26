import React from 'react';
import assets from '../../public/assets/assets';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-[9999]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
        className="relative w-40 h-40 flex items-center justify-center "
      >
        <motion.img 
          src={assets.logo_short}
          alt="Aural Logo"
          className="w-32 h-32 object-contain z-10"
          // animate={{
          //   scale: [1, 1.1, 1],
          //   rotate: [0, 5, -5, 0]
          // }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
        
        <motion.div
          className="absolute inset-0 border-4 border-t-auralblue border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute inset-0 border-4 border-r-auralyellow border-t-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 text-auralblue font-outfit text-xl font-medium space-y-2 text-center"
      >
        <motion.div
          animate={{ 
            opacity: [0.6, 1, 0.6],
            y: ["0%", "-10%", "0%"]
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading...
        </motion.div>
        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-auralblue"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "30%", "70%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
