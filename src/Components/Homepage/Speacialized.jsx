'use client';
import React, { useState } from 'react';
import topics from './topics.js';

const Specialized = () => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleViewMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 transition-all duration-500 ease-in-out pt-28 pb-10">
      {/* Topic Boxes */}
      <div className="flex justify-center space-x-4 mb-6">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`flex flex-col items-center justify-center cursor-pointer p-4 rounded-lg border w-36 h-36
            ${selectedTopic.id === topic.id ? 'bg-auralblue border-auralblue text-white transform translate-y-[-10px]' : 'bg-white shadow-xl text-black'} 
            hover:bg-auralblue hover:text-white transition-all duration-300 ease-in-out`}
            onClick={() => handleTopicClick(topic)}
          >
            <div className="text-3xl mb-2">{topic.logo}</div>
            <span className="text-sm font-semibold text-center">{topic.name}</span>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div 
        className={`p-4 bg-white  rounded-lg transition-all duration-500 ease-in-out overflow-hidden 
        ${isExpanded ? 'max-h-[3000px]' : 'max-h-[700px]'}`}>
        <h2 className="text-4xl rounded-lg text-center font-bold py-5 w-full font-outfit bg-auralyellow mb-2 text-white">{selectedTopic.name}</h2>
        <div>{selectedTopic.content}</div>
      </div>

      {/* View More/View Less Button */}
      <div className="flex justify-center mt-4">
        <button 
          className="px-4 py-2 bg-auralblue text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-auralblue-light" 
          onClick={handleViewMoreClick}
        >
          {isExpanded ? 'View Less' : 'View More'}
        </button>
      </div>
    </div>
  );
};

export default Specialized;
