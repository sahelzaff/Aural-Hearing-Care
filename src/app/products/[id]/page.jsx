'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaShare } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Footer from '@/Components/Global Components/Footer';
import Breadcrumbs from '@/Components/Global Components/Breadcrumbs';
import ProductImageGallery from '@/Components/Products/ProductImageGallery';
import Dummy_Products from '@/data/Dummy_Products';
import ShippingBanner from '@/Components/Global Components/ShippingBanner';
import ReviewSection from '@/Components/Products/ReviewSection';

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center">
      <label className="text-gray-700 font-poppins mr-4">Quantity:</label>
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-2 bg-white hover:bg-gray-50 transition-colors  border-auralblue border-r-2 text-gray-600 rounded-none "
        >
          -
        </button>
        <span className="px-6 py-2 text-center min-w-[40px] bg-white">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-2 bg-white hover:bg-gray-50 transition-colors border-auralblue border-l-2 text-gray-600 rounded-none "
        >
          +
        </button>
      </div>
    </div>
  );
};
  
const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  // Find the product from dummy data
  const product = Dummy_Products.find(p => p.id === id) || Dummy_Products[0];

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const isProductInWishlist = wishlistItems.some(item => item.id === product.id);
    setIsInWishlist(isProductInWishlist);
  }, [wishlistItems, product.id]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      quantity: quantity
    }));
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
    setIsInWishlist(!isInWishlist);
  };

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      <div className="min-h-screen bg-white pb-12">
        <ShippingBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="bg-white overflow-hidden">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <ProductImageGallery images={product.images} />

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-outfit">{product.name}</h1>
                  <p className="text-lg text-auralblue font-medium mt-2 font-poppins">{product.brand}</p>
                </div>

                <div className="border-t border-b py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-gray-500 font-poppins">Price:</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-gray-900 font-poppins">
                          ₹{product.discounted_price || product.price}
                        </span>
                        {product.discounted_price && (
                          <span className="text-lg text-gray-500 line-through font-poppins">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-green-600 font-poppins">{product.stock_status}</span>
                  </div>
                </div>

                 {/* Quick Specifications */}
                 <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-gray-500 font-poppins capitalize">{key.replace('_', ' ')}:</p>
                      <p className="font-medium font-poppins">{value}</p>
                    </div>
                  ))}
                </div>

                 {/* Purchase Controls */}
                 <div className="space-y-4 pt-4">
                  <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-auralblue text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                    <div
                      onClick={handleWishlistToggle}
                      className={`p-3 rounded-lg border transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'hover:bg-gray-50'}`}
                    >
                      <FaHeart className={`text-2xl ${isInWishlist ? 'text-white' : 'text-red-500'}`} />
                    </div>
                    <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaShare className="text-gray-500 text-2xl" />
                    </div>
                  </div>
                </div>

               

                {/* Features Section */}
                {product.features && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-outfit">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-gray-600 font-poppins">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

               
              </div>
            </div>

            {/* Full Specifications Section */}
            <div className="mt-12 px-8 pb-8">
              <h2 className="text-2xl font-bold mb-6 font-outfit">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-outfit">Description</h3>
                  <p className="text-gray-600 font-poppins">{product.description}</p>
                </div>

                {/* Full Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 font-outfit">Full Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-gray-500 font-poppins capitalize">{key.replace(/_/g, ' ')}:</p>
                        <p className="font-medium font-poppins">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="px-8">
              <ReviewSection productId={id} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;