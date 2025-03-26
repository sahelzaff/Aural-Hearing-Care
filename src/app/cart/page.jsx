'use client';
import { useSelector, useDispatch } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Navbar from '@/Components/Global Components/Navbar';
import Footer from '@/Components/Global Components/Footer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useCart from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  
  // Get session status safely with fallback values
  const { data: session, status } = useSession({
    required: false,
    onUnauthenticated() {
      // This is optional - will be called if the user is not authenticated
      console.log('User is not authenticated');
    },
  });
  
  // Use our new cart hook
  const { 
    cart, 
    loading, 
    error, 
    isEmpty,
    isGuestCart,
    removeItem, 
    updateItemQuantity, 
    clearCart,
    applyCoupon,
    removeCoupon,
    fetchCart
  } = useCart();
  
  // Limit debug logging to prevent excessive API calls
  useEffect(() => {
    if (cart) {
      // Log more detailed information to help debug cart issues
      console.log("Cart page debug info:", {
        items: cart.items,
        itemCount: cart.item_count,
        subtotal: cart.subtotal,
        total: cart.total || cart.subtotal, // Fall back to subtotal if total is 0
        isEmpty,
        isGuestCart
      });
    }
  }, [cart?.id, cart?.items, isEmpty, isGuestCart]); // Include items array for better tracking

  // Force cart refresh on mount, but ensure we get fresh data
  useEffect(() => {
    // Force refresh the cart (bypass throttling) when the cart page is loaded
    fetchCart(true);
    // No dependencies array - this will only run once when component mounts
  }, []);

  const handleIncreaseQuantity = (item) => {
    updateItemQuantity(item.id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity === 1) {
      removeItem(item.id);
    } else {
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };

  const handleCheckout = async () => {
    // Check authentication status
    if (status === 'authenticated') {
      // User is logged in with NextAuth, proceed to checkout
      router.push('/checkout');
    } else if (status === 'unauthenticated') {
      // User is not authenticated, save current path and redirect to login with return URL
      const returnUrl = encodeURIComponent('/checkout');
      
      // If this is a guest cart, save cart information in localStorage
      if (isGuestCart) {
        console.log('Saving guest cart information before redirecting to login');
        
        // We don't need to do anything special here since the session token is already
        // stored in localStorage and will be used during mergeGuestCart after login
        
        // Optionally, we could set a flag to indicate we need to merge carts after login
        localStorage.setItem('should_merge_cart', 'true');
      }
      
      router.push(`/login?redirect=${returnUrl}`);
    } else {
      // Loading state or unknown, show a message and handle accordingly
      console.log('Authentication status is loading or unknown:', status);
      toast.loading('Preparing checkout...');
      
      // For safety, redirect to login with return URL after a short delay
      setTimeout(() => {
        const returnUrl = encodeURIComponent('/checkout');
        router.push(`/login?redirect=${returnUrl}`);
      }, 1000);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setCouponError('');
    const result = await applyCoupon(couponCode.trim());
    
    if (result.success) {
      toast.success('Coupon applied successfully');
      setCouponCode('');
      setShowCouponInput(false);
    } else {
      setCouponError(result.message || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = async () => {
    const result = await removeCoupon();
    
    if (result.success) {
      toast.success('Coupon removed');
    } else {
      toast.error('Failed to remove coupon');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-auralblue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your cart...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-outfit">Something went wrong</h2>
          <p className="text-gray-600 mb-6 font-poppins">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-block bg-auralblue text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <>
        {/* <TopbarBelow /> */}
        {/* <Navbar /> */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 font-poppins">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              href="/products" 
              className="inline-block bg-auralblue text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {/* <TopbarBelow /> */}
      {/* <Navbar /> */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 font-outfit text-auralyellow">Shopping Cart</h1>
          
          {isGuestCart && (
            <div className="bg-auralblue bg-opacity-10 p-4 rounded-lg mb-6">
              <p className="font-poppins text-auralblue">
                You're shopping as a guest. <Link href="/login" className="font-semibold underline">Sign in</Link> to access your saved cart and checkout faster.
              </p>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center p-6 border-b border-gray-200">
                    {item.product_image ? (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name || 'Product'} 
                        className="w-24 h-24 object-cover rounded-md"
                        onError={(e) => {
                          e.target.src = '/assets/product_1.avif'; // Fallback image
                          console.log('Cart image failed to load:', item.product_image);
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 ml-6">
                      <h3 className="text-lg font-semibold font-outfit">{item.product_name || 'Product'}</h3>
                      <p className="text-gray-600 font-poppins">{item.brand_name || item.brand || ''}</p>
                      <p className="text-auralblue font-medium font-poppins">
                        ₹{(item.discounted_price || item.unit_price || 0).toLocaleString('en-IN')}
                        {item.discounted_price && item.unit_price && item.discounted_price < item.unit_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{item.unit_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <div 
                          onClick={() => handleDecreaseQuantity(item)}
                          className="px-3 py-2 cursor-pointer border-r border-gray-300"
                        >
                          <FaMinus className="text-auralblue w-3 h-3" />
                        </div>
                        <span className="px-4 py-2 font-medium text-gray-700 bg-white">{item.quantity}</span>
                        <div 
                          onClick={() => handleIncreaseQuantity(item)}
                          className="px-3 py-2 cursor-pointer border-l border-gray-300"
                        >
                          <FaPlus className="text-auralblue w-3 h-3" />
                        </div>
                      </div>
                      <FaTrash 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 w-4 h-4 cursor-pointer hover:text-red-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 font-outfit">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between font-poppins">
                    <span>Subtotal ({cart.item_count} items)</span>
                    <span>₹{cart.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-poppins">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  
                  {cart.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600 font-poppins">
                      <span>Discount</span>
                      <span>-₹{cart.discount_amount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  {cart.tax_amount > 0 && (
                    <div className="flex justify-between font-poppins">
                      <span>Tax</span>
                      <span>₹{cart.tax_amount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-auralblue">₹{(cart.total || cart.subtotal).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                {!cart.coupon && (
                  <div className="mt-4">
                    {showCouponInput ? (
                      <div className="mt-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            className={`flex-1 border ${couponError ? 'border-red-300' : 'border-gray-300'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-auralblue focus:border-transparent`}
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="px-3 py-2 bg-auralblue text-white rounded-md text-sm font-medium hover:bg-opacity-90"
                          >
                            Apply
                          </button>
                          <button
                            onClick={() => {
                              setShowCouponInput(false);
                              setCouponCode('');
                              setCouponError('');
                            }}
                            className="px-2 py-2 bg-gray-100 text-gray-500 rounded-md hover:bg-gray-200"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-xs mt-1">{couponError}</p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="text-sm text-auralblue font-medium hover:underline"
                      >
                        Have a coupon code?
                      </button>
                    )}
                  </div>
                )}

                <button 
                  className="w-full bg-auralyellow text-white py-3 rounded-md font-medium mt-6 hover:bg-opacity-90 transition-colors"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                
                <button 
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-md font-medium mt-4 hover:bg-gray-200 transition-colors"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
              
              {cart.coupon && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg font-outfit">Applied Coupon</h3>
                      <p className="text-auralblue font-medium">{cart.coupon.code}</p>
                      {cart.coupon.description && (
                        <p className="text-sm text-gray-500 mt-1">{cart.coupon.description}</p>
                      )}
                    </div>
                    <button 
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default CartPage;