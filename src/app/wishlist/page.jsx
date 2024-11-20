'use client';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { motion } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Navbar from '@/Components/Global Components/Navbar';
import Footer from '@/Components/Global Components/Footer';

const WishlistPage = () => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <TopbarBelow />
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8 font-poppins">Discover and save your favorite items!</p>
            <Link 
              href="/products" 
              className="inline-block bg-auralblue text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopbarBelow />
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 font-outfit">My Wishlist</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm"
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-48 object-contain p-4"
                  />
                  <IoClose 
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-4 right-4 text-gray-600 text-2xl cursor-pointer hover:text-gray-800 transition-colors"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-outfit">{item.name}</h3>
                  <p className="text-gray-600 mb-2 font-poppins text-sm">{item.brand}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-auralblue font-poppins">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-auralyellow text-white py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart className="ml-0" />
                    Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage; 