'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaHeart, FaShare, FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/store/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/wishlistSlice';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Footer from '@/Components/Global Components/Footer';
import Breadcrumbs from '@/Components/Global Components/Breadcrumbs';
import ProductImageGallery from '@/Components/Products/ProductImageGallery';
import ShippingBanner from '@/Components/Global Components/ShippingBanner';
import ReviewSection from '@/Components/Products/ReviewSection';
import useProducts from '@/hooks/useProducts';

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center">
      <label className="text-gray-700 font-poppins mr-4">Quantity:</label>
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-2 bg-white hover:bg-gray-50 transition-colors border-auralblue border-r-2 text-gray-600 rounded-none"
        >
          -
        </button>
        <span className="px-6 py-2 text-center min-w-[40px] bg-white">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-2 bg-white hover:bg-gray-50 transition-colors border-auralblue border-l-2 text-gray-600 rounded-none"
        >
          +
        </button>
      </div>
    </div>
  );
};
  
const ProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  
  // Get product and related functions from custom hook
  const { 
    product, 
    loading, 
    error, 
    fetchProductById, 
    formatPrice,
    getImageUrl 
  } = useProducts();

  // Fetch product details on mount or when ID changes
  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  // Check if product is in wishlist when product or wishlist changes
  useEffect(() => {
    if (product) {
      const isProductInWishlist = wishlistItems.some(item => item.id === product.id);
      setIsInWishlist(isProductInWishlist);
    }
  }, [wishlistItems, product]);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Find a valid primary image URL with better error handling
    const imageUrl = product.images && product.images.length > 0
      ? (() => {
          // First look for a primary image with a valid URL
          const primaryImage = product.images.find(img => 
            img && img.is_primary && img.url && 
            typeof img.url === 'string' && 
            (img.url.startsWith('http') || img.url.startsWith('/'))
          );
          
          // If no valid primary image, look for any valid image
          if (primaryImage) return primaryImage.url;
          
          // Otherwise find the first valid image
          const firstValidImage = product.images.find(img => 
            img && img.url && 
            typeof img.url === 'string' && 
            (img.url.startsWith('http') || img.url.startsWith('/'))
          );
          
          // Return valid image or fallback
          return firstValidImage ? firstValidImage.url : '/assets/product_1.avif';
        })()
      : '/assets/product_1.avif'; // Fallback image if no images available
    
    // Prepare product data for cart with all required fields
    const cartProduct = {
      id: product.id,
      name: product.name || 'Product',
      brand_name: product.brand_name || '',
      price: product.discounted_price ? parseFloat(product.discounted_price) : parseFloat(product.price),
      original_price: parseFloat(product.price),
      discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : null,
      quantity: quantity,
      image: imageUrl,
      stock_status: product.stock_status || 'In Stock'
    };
    
    console.log('Adding product to cart:', cartProduct);
    
    // Dispatch the action with properly formatted product
    dispatch(addToCart(cartProduct));
    
    // Fire a custom event for notification system
    const event = new CustomEvent('cartAdd', { 
      detail: cartProduct
    });
    window.dispatchEvent(event);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;
    
    // Find a valid primary image URL with better error handling
    const imageUrl = product.images && product.images.length > 0
      ? (() => {
          // First look for a primary image with a valid URL
          const primaryImage = product.images.find(img => 
            img && img.is_primary && img.url && 
            typeof img.url === 'string' && 
            (img.url.startsWith('http') || img.url.startsWith('/'))
          );
          
          // If no valid primary image, look for any valid image
          if (primaryImage) return primaryImage.url;
          
          // Otherwise find the first valid image
          const firstValidImage = product.images.find(img => 
            img && img.url && 
            typeof img.url === 'string' && 
            (img.url.startsWith('http') || img.url.startsWith('/'))
          );
          
          // Return valid image or fallback
          return firstValidImage ? firstValidImage.url : '/assets/product_1.avif';
        })()
      : '/assets/product_1.avif'; // Fallback image if no images available
    
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
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(wishlistProduct));
    }
    setIsInWishlist(!isInWishlist);
  };

  // Set up breadcrumbs with categories
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(product?.categories?.[0] ? [{ 
      label: product.categories[0].name,
      href: `/products?category=${product.categories[0].slug}` 
    }] : []),
    { label: product?.name || 'Product Details' },
  ];

  // If there's an error, show error state
  if (error) {
    return (
      <>
        <TopbarBelow />
        <ClientNavbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => router.push('/products')}
              className="bg-auralblue text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* <TopbarBelow /> */}
      {/* <ClientNavbar /> */}
      <div className="min-h-screen bg-white pb-12">
        <ShippingBanner />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          
          {loading ? (
            <div className="min-h-[600px] flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <FaSpinner className="text-4xl text-auralblue animate-spin" />
                <p className="text-gray-600 font-poppins">Loading product details...</p>
              </div>
            </div>
          ) : product ? (
            <div className="bg-white overflow-hidden">
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Product Images */}
                <ProductImageGallery 
                  images={product.images && product.images.length > 0 
                    ? (() => {
                        // Debug log to help troubleshoot
                        console.log('Original product images:', product.images);
                        
                        // Filter valid image URLs only - ensure only valid URLs are passed
                        const validImages = product.images
                          .filter(img => {
                            // Ensure the image object and URL are valid
                            const isValid = img && img.url && 
                              typeof img.url === 'string' && 
                              (img.url.startsWith('http') || img.url.startsWith('/'));
                            
                            if (!isValid) {
                              console.log('Filtered out invalid image URL:', img);
                            }
                            
                            return isValid;
                          })
                          .map(img => ({
                            url: img.url,
                            alt_text: img.alt_text || product.name,
                            is_primary: img.is_primary || false
                          }));
                        
                        // Sort images to ensure primary images are first
                        const sortedImages = [...validImages].sort((a, b) => {
                          if (a.is_primary && !b.is_primary) return -1;
                          if (!a.is_primary && b.is_primary) return 1;
                          return 0;
                        });
                          
                        console.log('Filtered and sorted product images:', sortedImages);
                        return sortedImages;
                      })()
                    : []
                  } 
                />

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit">{product.name}</h1>
                    <p className="text-lg text-auralblue font-medium mt-2 font-poppins">{product.brand_name}</p>
                  </div>

                  <div className="border-t border-b py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-gray-500 font-poppins">Price:</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold text-gray-900 font-poppins">
                            {formatPrice(product.discounted_price || product.price)}
                          </span>
                          {product.discounted_price && (
                            <span className="text-lg text-gray-500 line-through font-poppins">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        {product.discount_percentage && (
                          <span className="text-sm text-green-600 font-poppins">
                            Save {product.discount_percentage}%
                          </span>
                        )}
                      </div>
                      <span className={`font-poppins ${product.stock_status === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock_status}
                      </span>
                    </div>
                  </div>

                  {/* Quick Description */}
                  <div className="text-gray-600 font-poppins">
                    {product.short_description}
                  </div>

                  {/* Purchase Controls */}
                  <div className="space-y-4 pt-4">
                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock_status !== 'In Stock'}
                        className={`flex-1 bg-auralblue text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2
                          ${product.stock_status !== 'In Stock' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                      >
                        <FaShoppingCart />
                        <span>{product.stock_status === 'In Stock' ? 'Add to Cart' : 'Out of Stock'}</span>
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
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold font-outfit">Key Features</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {product.features.map((feature) => (
                          <li key={feature.id} className="text-gray-600 font-poppins">
                            {feature.feature_name}
                            {feature.feature_value && `: ${feature.feature_value}`}
                          </li>
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
                    <p className="text-gray-600 font-poppins whitespace-pre-line">
                      {product.description || product.short_description || 'No description available.'}
                    </p>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 font-outfit">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {product.brand_name && (
                        <div className="space-y-1">
                          <p className="text-gray-500 font-poppins">Brand:</p>
                          <p className="font-medium font-poppins">{product.brand_name}</p>
                        </div>
                      )}
                      {product.categories?.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-gray-500 font-poppins">Category:</p>
                          <p className="font-medium font-poppins">
                            {product.categories.map(cat => cat.name).join(', ')}
                          </p>
                        </div>
                      )}
                      {product.warranty_duration && (
                        <div className="space-y-1">
                          <p className="text-gray-500 font-poppins">Warranty:</p>
                          <p className="font-medium font-poppins">{product.warranty_duration}</p>
                        </div>
                      )}
                      {product.stock_quantity > 0 && (
                        <div className="space-y-1">
                          <p className="text-gray-500 font-poppins">Availability:</p>
                          <p className="font-medium font-poppins">{product.stock_quantity} in stock</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="px-8">
                <ReviewSection productId={id} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ProductDetails;