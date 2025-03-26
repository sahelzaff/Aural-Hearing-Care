'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaStar, FaGoogle } from 'react-icons/fa';
import defaultReviews from '../../data/reviews';

const Reviews = ({ 
  title = "What Our Patients Say",
  titleColor = "text-gray-800",
  accentColor = "bg-auralblue", 
  bgColor = "bg-white",
  maxReviews = 9,
  customReviews = null,
  slidesToShow = 3, // Number of slides to show at once on desktop
  autoplaySpeed = 3000, // in milliseconds
  gmb_review_url = "https://g.page/r/CULh-LtkV86yEBM/review" // Replace with your actual GMB review URL
}) => {
  // State to manage reviews
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(slidesToShow);
  const [expandedReview, setExpandedReview] = useState(null);
  const autoplayTimerRef = useRef(null);
  
  // Update number of slides based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(slidesToShow);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [slidesToShow]);

  // Load reviews on component mount
  useEffect(() => {
    // Use custom reviews if provided, otherwise use default reviews
    let reviewsToUse = customReviews || defaultReviews;
    
    // Randomly shuffle the reviews for variety
    reviewsToUse = [...reviewsToUse].sort(() => Math.random() - 0.5);
    
    // Take only the specified number of reviews
    setReviews(reviewsToUse.slice(0, maxReviews));
    setLoading(false);
  }, [customReviews, maxReviews]);

  // Auto-slide functionality
  useEffect(() => {
    if (reviews.length > slidesPerView) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const newIndex = prevIndex + 1;
          return newIndex > reviews.length - slidesPerView ? 0 : newIndex;
        });
      }, autoplaySpeed);
    }
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [currentIndex, reviews.length, slidesPerView, autoplaySpeed]);

  // Generate star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  // Function to truncate text with character limit
  const truncateText = (text, charLimit = 150) => {
    if (text.length <= charLimit) return text;
    return text.substring(0, charLimit) + '...';
  };
  
  // Handle Read More click
  const handleReadMoreClick = (e, reviewId) => {
    e.stopPropagation();
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
    
    // When a review is expanded, pause the autoplay
    if (expandedReview !== reviewId) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    } else {
      // Resume autoplay when collapsed
      if (!autoplayTimerRef.current) {
        autoplayTimerRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            return newIndex > reviews.length - slidesPerView ? 0 : newIndex;
          });
        }, autoplaySpeed);
      }
    }
  };

  // Handle clicks outside to close expanded review
  useEffect(() => {
    const handleClickOutside = () => {
      if (expandedReview !== null) {
        setExpandedReview(null);
        
        // Resume autoplay
        if (!autoplayTimerRef.current) {
          autoplayTimerRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => {
              const newIndex = prevIndex + 1;
              return newIndex > reviews.length - slidesPerView ? 0 : newIndex;
            });
          }, autoplaySpeed);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [expandedReview, reviews.length, slidesPerView, autoplaySpeed]);

  // Early return for loading state
  if (loading) {
    return (
      <section className={`py-16 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-auralblue border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <h2 className={`text-3xl md:text-4xl font-bold ${titleColor} mb-4 font-outfit`}>
            {title}
          </h2>
          <div className={`w-20 h-1 ${accentColor} mx-auto mb-6`}></div>
          
          {/* Google Review Button */}
          <a 
            href={gmb_review_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all mt-4 hover:bg-gray-50 group"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <FaGoogle className="text-[#4285F4] text-xl group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-medium text-gray-700">Write a Review on Google</span>
          </a>
        </motion.div>
        
        {/* Testimonials Slider */}
        <div className="relative overflow-hidden">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            animate={{ 
              x: `calc(-${currentIndex * (100 / reviews.length)}%)` 
            }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.8 }}
            style={{ 
              width: `${(reviews.length / slidesPerView) * 100}%`,
              display: "grid",
              gridTemplateColumns: `repeat(${reviews.length}, 1fr)`,
            }}
          >
            {reviews.map((review, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-gradient-to-b from-auralblue/5 to-white rounded-xl p-6 border-2 border-auralblue/10 hover:border-auralblue/20 shadow-md hover:shadow-lg transition-all relative"
                style={{ 
                  transform: "translateZ(0)",
                  width: `calc(100% - 2rem)`
                }}
              >
                <div className="absolute top-4 left-4 opacity-10">
                  <Image src={review.accentImage} alt="quote" width={40} height={40} />
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-auralblue/20 mb-4">
                    <Image 
                      src={review.image} 
                      alt={review.name} 
                      width={64} 
                      height={64} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(review.stars)}
                  </div>
                </div>
                
                <div className="relative z-10 text-center" style={{ minHeight: "120px" }}>
                  <p className="text-gray-600 mb-4">
                    "{truncateText(review.text)}"
                    {review.text.length > 150 && (
                      <button 
                        onClick={(e) => handleReadMoreClick(e, review.id)} 
                        className="text-auralblue hover:underline ml-1 font-medium"
                      >
                        Read more
                      </button>
                    )}
                  </p>
                </div>
                
                <div className="text-center mt-4">
                  <h4 className="text-lg font-semibold text-gray-800">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.duration}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Expanded Review Modal */}
        {expandedReview && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedReview(null);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2"
                onClick={() => setExpandedReview(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {reviews.find(r => r.id === expandedReview) && (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-auralblue/20 mb-4">
                      <Image 
                        src={reviews.find(r => r.id === expandedReview).image} 
                        alt={reviews.find(r => r.id === expandedReview).name} 
                        width={80} 
                        height={80} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(reviews.find(r => r.id === expandedReview).stars)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{reviews.find(r => r.id === expandedReview).name}</h3>
                    <p className="text-sm text-gray-500">{reviews.find(r => r.id === expandedReview).duration}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-700 text-lg">
                      "{reviews.find(r => r.id === expandedReview).text}"
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews; 