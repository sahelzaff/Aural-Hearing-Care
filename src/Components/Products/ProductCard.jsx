'use client';
import React, { useState } from 'react';
import { FaStar, FaShoppingCart, FaRegHeart, FaHeart } from 'react-icons/fa';
import { IoIosHeart } from "react-icons/io";
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="relative group overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        </Link>
        
        <div 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 cursor-pointer transition-opacity duration-300"
        >
          {isWishlisted ? (
            <IoIosHeart  className="text-2xl text-[#dc143c]" />
          ) : (
            <IoIosHeart  className="text-2xl text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#dc143c] transition-colors duration-300" />
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex justify-center">
          <button 
            className="text-sm py-3 px-6  bg-auralblue text-white opacity-80 font-medium font-poppins hover:bg-opacity-60 transition-colors duration-300"
            onClick={() => console.log('Request Demo for:', product.name)}
          >
            Request Demo
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3">
          <span className="text-sm text-auralblue font-medium font-poppins">{product.brand}</span>
          <h3 className="text-lg font-semibold font-outfit truncate mt-1">{product.name}</h3>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                className={`w-4 h-4 ${
                  index < product.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-auralblue font-poppins">
            ₹{product.price.toLocaleString()}
          </span>
          <button 
            className="flex items-center gap-1 px-3 py-2 bg-auralyellow text-white rounded-lg hover:bg-opacity-90 transition-colors max-w-fit"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="text-sm ml-0" />
            <span className="font-medium text-sm whitespace-nowrap">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;