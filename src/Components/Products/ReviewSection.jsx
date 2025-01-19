'use client';
import React, { useState } from 'react';
import { FaStar, FaCheck, FaThumbsUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getProductReviews, getAverageRating, getRatingDistribution } from '@/data/ProductReviews';
import ImageModal from './ImageModal';

const ReviewSection = ({ productId }) => {
  const [helpfulReviews, setHelpfulReviews] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const ratingDistribution = getRatingDistribution(productId);
  const totalReviews = reviews.length;

  const handleHelpfulClick = (reviewId) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const handleImageClick = (images, startIndex) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-16 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6 font-outfit">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-7">
        {/* Reviews Summary */}
        <div className="md:col-span-2 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-4xl font-bold mr-4">{averageRating}</div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Based on {totalReviews} reviews</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {Object.entries(ratingDistribution).reverse().map(([rating, count]) => (
                <div key={rating} className="flex items-center">
                  <div className="w-20 text-sm">{rating} stars</div>
                  <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${(count / totalReviews) * 100}%`
                      }}
                    />
                  </div>
                  <div className="w-10 text-sm text-gray-600">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-5 space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b pb-6"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    {review.verified_purchase && (
                      <span className="ml-2 text-green-600 text-sm flex items-center">
                        <FaCheck className="mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mt-1 font-outfit">{review.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              
              <div className="mb-2">
                <span className="font-medium text-gray-900">{review.user}</span>
              </div>
              
              <p className="text-gray-700 mb-4 font-poppins">{review.review}</p>
              
              {review.images && (
                <div className="flex gap-4 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(review.images, index)}
                    />
                  ))}
                </div>
              )}
              
              <button
                onClick={() => handleHelpfulClick(review.id)}
                className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                  helpfulReviews.has(review.id)
                    ? 'border-auralblue text-auralblue'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <FaThumbsUp />
                <span>Helpful ({review.helpful_count + (helpfulReviews.has(review.id) ? 1 : 0)})</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={selectedImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />
    </div>
  );
};

export default ReviewSection; 