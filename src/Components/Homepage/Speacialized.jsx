'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import topics from './topics.js';

const Specialized = () => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setIsExpanded(false); // Reset expanded state when switching topics
  };

  const handleViewMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 transition-all duration-500 ease-in-out pt-28 pb-10">
      <div className="flex justify-center space-x-4 mb-6">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center cursor-pointer p-4 rounded-lg border w-36 h-36
              ${selectedTopic.id === topic.id 
                ? 'bg-auralblue border-auralblue text-white transform translate-y-[-10px] shadow-lg' 
                : 'bg-white shadow-xl text-black hover:bg-gray-50'} 
              hover:border-auralblue transition-all duration-300 ease-in-out`}
            onClick={() => handleTopicClick(topic)}
          >
            <div className="text-3xl mb-2">{topic.logo}</div>
            <span className="text-sm font-semibold text-center">{topic.name}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTopic.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-4 bg-white transition-all duration-500 ease-in-out overflow-hidden`}
        >
          <h2 className="text-4xl rounded-lg text-center font-bold py-5 w-full font-outfit bg-auralyellow mb-4 text-white shadow-md">
            {selectedTopic.name}
          </h2>
          
          <motion.div 
            className="relative"
            animate={{ height: isExpanded ? "auto" : "500px" }}
            transition={{ duration: 0.5 }}
          >
            <div className={`overflow-hidden transition-all duration-500 ${!isExpanded && "max-h-[500px]"}`}>
              {selectedTopic.content}
            </div>
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/70 to-transparent" />
            )}
          </motion.div>

          <div className="flex justify-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-auralblue text-white rounded-lg transition-all duration-300 hover:bg-opacity-90 font-medium flex items-center gap-2 shadow-md"
              onClick={handleViewMoreClick}
            >
              {isExpanded ? (
                <>
                  View Less
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </>
              ) : (
                <>
                  View More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Specialized;
