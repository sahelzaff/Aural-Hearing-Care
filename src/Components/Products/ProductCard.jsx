'use client';
import React, { useState } from 'react';
import { FaStar, FaShoppingCart, FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoIosHeart } from "react-icons/io";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import useProducts from '@/hooks/useProducts';
import useCart from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { formatPrice, getImageUrl } = useProducts();
  
  // Use the cart hook to directly add items to the backend
  const { addItem } = useCart();

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get image URL, with fallback for errors
  const productImageUrl = imageError 
    ? '/assets/product_1.avif' 
    : getImageUrl(product);

  // Format price with INR currency
  const formattedPrice = formatPrice(product.price);
  const formattedDiscountedPrice = product.discounted_price 
    ? formatPrice(product.discounted_price) 
    : null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Get image URL with proper fallback
    const imageUrl = productImageUrl || '/assets/product_1.avif';
    
    // Prepare complete product data for cart API with all needed fields
    const apiProduct = {
      product_id: product.id,
      quantity: 1,
      // Include full product details for proper display in notifications
      name: product.name || 'Product',
      product_name: product.name || 'Product',
      brand_name: product.brand_name || '',
      brand: product.brand_name || '',
      price: product.discounted_price ? parseFloat(product.discounted_price) : parseFloat(product.price),
      unit_price: parseFloat(product.price),
      discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : null,
      image: imageUrl,
      product_image: imageUrl,
      product_slug: product.slug || '',
      stock_status: product.stock_status || 'In Stock'
    };
    
    console.log('Adding product to cart from product card with API payload:', apiProduct);
    
    try {
      // Call the API directly through our useCart hook
      const result = await addItem(apiProduct);
      
      if (result.success) {
        toast.success(`${product.name} added to cart`);
      } else {
        console.error('Failed to add product to cart:', result.message);
        toast.error(result.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = () => {
    // Get image URL with proper fallback
    const imageUrl = productImageUrl || '/assets/product_1.avif';
    
    // Prepare product data for wishlist with all required fields
    const wishlistProduct = {
      id: product.id,
      name: product.name || 'Product',
      brand_name: product.brand_name || '',
      price: product.discounted_price ? parseFloat(product.discounted_price) : parseFloat(product.price),
      original_price: parseFloat(product.price),
      discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : null,
      image: imageUrl,
      stock_status: product.stock_status || 'In Stock'
    };
    
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(wishlistProduct));
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative group overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-[280px]">
            <Image 
              src={productImageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          </div>
        </Link>
        
        <motion.div 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 cursor-pointer transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isWishlisted ? (
            <IoIosHeart className="text-2xl text-[#dc143c]" />
          ) : (
            <IoIosHeart className="text-2xl text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#dc143c] transition-colors duration-300" />
          )}
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex justify-center">
          <motion.button 
            className={`relative flex items-center justify-center px-4 py-2.5 text-white rounded-lg transition-all min-w-[160px] h-[42px] shadow-md overflow-hidden`}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isAdding || product.stock_status === 'Out of Stock'}
            style={{
              background: isAdding 
                ? "linear-gradient(to right, #22c55e, #16a34a)" 
                : product.stock_status === 'Out of Stock' 
                  ? "linear-gradient(to right, #6b7280, #4b5563)"
                  : "linear-gradient(to right, #fbb034, #f59e0b)"
            }}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400
                  }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ 
                      scale: 1, 
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10
                      }
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-1 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                  <span className="font-medium">Added</span>
                </motion.div>
              ) : product.stock_status === 'Out of Stock' ? (
                <motion.span
                  key="outOfStock"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="truncate">Out of Stock</span>
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 2 }}
                    animate={{ 
                      scale: 1, 
                      y: 0,
                      transition: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <FaShoppingCart className="text-sm shrink-0" />
                  </motion.div>
                  <span className="truncate font-medium">Add to Cart</span>
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Add subtle background animation */}
            <motion.div 
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ 
                x: "100%",
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  repeatDelay: 0.5
                }
              }}
            />
          </motion.button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className="text-sm text-auralblue font-medium font-poppins">{product.brand_name}</span>
          <h3 className="text-lg font-semibold font-outfit truncate mt-1">{product.name}</h3>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={`w-4 h-4 ${
                  index < Math.round(product.rating_average || 0) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">({product.rating_count || 0})</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-auralblue font-poppins">
              {formattedDiscountedPrice || formattedPrice}
            </span>
            {formattedDiscountedPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formattedPrice}
              </span>
            )}
          </div>
          <motion.button 
            className={`relative flex items-center justify-center px-4 py-2.5 text-white rounded-lg transition-all min-w-[160px] h-[42px] shadow-md overflow-hidden`}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.03, boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isAdding || product.stock_status === 'Out of Stock'}
            style={{
              background: isAdding 
                ? "linear-gradient(to right, #22c55e, #16a34a)" 
                : product.stock_status === 'Out of Stock' 
                  ? "linear-gradient(to right, #6b7280, #4b5563)"
                  : "linear-gradient(to right, #fbb034, #f59e0b)"
            }}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400
                  }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ 
                      scale: 1, 
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10
                      }
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-1 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                  <span className="font-medium">Added</span>
                </motion.div>
              ) : product.stock_status === 'Out of Stock' ? (
                <motion.span
                  key="outOfStock"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="truncate">Out of Stock</span>
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 2 }}
                    animate={{ 
                      scale: 1, 
                      y: 0,
                      transition: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 1,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <FaShoppingCart className="text-sm shrink-0" />
                  </motion.div>
                  <span className="truncate font-medium">Add to Cart</span>
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Add subtle background animation */}
            <motion.div 
              className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ 
                x: "100%",
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                  repeatDelay: 0.5
                }
              }}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;