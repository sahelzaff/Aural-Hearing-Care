'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AddToCartButton component for product detail pages
 * Uses the seamless cart initialization feature for fast cart operations
 */
const AddToCartButton = ({ product, quantity = 1 }) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  // Use our cart hook
  const { addItem } = useCart();
  
  // Regular add to cart
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Create a complete product object with all necessary information
      // Make sure we include all available product details to properly display in notifications
      const apiProduct = {
        product_id: product.id,
        quantity: quantity,
        name: product.name,
        price: product.discounted_price || product.price,
        unit_price: product.price,
        discounted_price: product.discounted_price,
        product_name: product.name,
        brand_name: product.brand_name,
        brand: product.brand_name,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        product_image: product.images && product.images.length > 0 ? product.images[0].url : null,
        product_slug: product.slug
      };
      
      // Only add these fields if they exist to keep the payload clean
      if (product.selected_variant_id) {
        apiProduct.variant_id = product.selected_variant_id;
      }
      
      if (product.selected_options) {
        apiProduct.custom_options = product.selected_options;
      }
      
      console.log('Adding product to cart with API payload:', apiProduct);
      const result = await addItem(apiProduct);
      
      if (result.success) {
        toast.success(`${product.name} added to cart!`);
      } else {
        console.error('Error from API:', result.message);
        toast.error(result.message || "Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };
  
  // Buy now - directly calls addItem and redirects to cart
  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      // Create a complete product object with all necessary information
      // Make sure we include all available product details
      const apiProduct = {
        product_id: product.id,
        quantity: quantity,
        name: product.name,
        price: product.discounted_price || product.price,
        unit_price: product.price,
        discounted_price: product.discounted_price,
        product_name: product.name,
        brand_name: product.brand_name,
        brand: product.brand_name,
        image: product.images && product.images.length > 0 ? product.images[0].url : null,
        product_image: product.images && product.images.length > 0 ? product.images[0].url : null,
        product_slug: product.slug
      };
      
      // Only add these fields if they exist to keep the payload clean
      if (product.selected_variant_id) {
        apiProduct.variant_id = product.selected_variant_id;
      }
      
      if (product.selected_options) {
        apiProduct.custom_options = product.selected_options;
      }
      
      console.log('Buying now with API payload:', apiProduct);
      const result = await addItem(apiProduct);
      
      if (result.success) {
        // Navigate to checkout immediately
        router.push('/cart');
      } else {
        console.error('Error from API:', result.message);
        toast.error(result.message || "Failed to process. Please try again.");
      }
    } catch (error) {
      console.error("Error with buy now:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsBuyingNow(false);
    }
  };
  
  // Button animations
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.03,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
      transition: {
        duration: 0.1
      }
    }
  };
  
  // Loader animations
  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }
    }
  };
  
  // Icon animations
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.1,
        type: "spring",
        stiffness: 300
      }
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <motion.button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed overflow-hidden relative py-3.5 px-6 shadow-md"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        style={{
          background: "linear-gradient(to right, #4c68d7, #3555d1)",
          boxShadow: "0 4px 12px rgba(76, 104, 215, 0.15)"
        }}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-auralblue/90 to-auralblue"
            >
              <motion.span 
                className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                variants={loaderVariants}
                animate="animate"
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="flex items-center justify-center gap-2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div variants={iconVariants} initial="initial" animate="animate">
                <FaShoppingCart className="text-lg" />
              </motion.div>
              <span className="font-semibold">Add to Cart</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <motion.button
        onClick={handleBuyNow}
        disabled={isBuyingNow}
        className="flex-1 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed overflow-hidden relative py-3.5 px-6 shadow-md"
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        style={{
          background: "linear-gradient(to right, #fbb034, #f9a825)",
          boxShadow: "0 4px 12px rgba(249, 168, 37, 0.2)"
        }}
      >
        <AnimatePresence mode="wait">
          {isBuyingNow ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-auralyellow/90 to-auralyellow"
            >
              <motion.span 
                className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                variants={loaderVariants}
                animate="animate"
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              className="flex items-center justify-center gap-2 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div variants={iconVariants} initial="initial" animate="animate">
                <FaBolt className="text-lg" />
              </motion.div>
              <span className="font-semibold">Buy Now</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AddToCartButton; 