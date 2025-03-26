'use client';

import React, { useEffect, useState, useContext } from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { CiHeart } from "react-icons/ci";
// Import assets directly
import Image from 'next/image';
import '../Components.css'
import { useSelector, useDispatch } from 'react-redux';
// Import AuthContext from the separate file
import AuthContext from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../LoadingScreen';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { getAuthToken, clearAuthTokens, isAuthenticated as checkAuthenticated, triggerAuthStateChange, getDeviceInfo } from '@/utils/auth';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Navbar = () => {
    const { user, loading, error } = {
        user: null,
        loading: false,
        error: null
    };

    // Use Redux for authentication if AuthContext is not available
    let reduxIsAuthenticated = false;
    let cartQuantity = 0;
    let wishlistCount = 0;
    let cartTotal = 0;
    
    try {
        reduxIsAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
        cartQuantity = useSelector((state) => state.cart?.totalQuantity) || 0;
        wishlistCount = useSelector((state) => state.wishlist?.items?.length) || 0;
        cartTotal = useSelector((state) => state.cart?.totalAmount) || 0;
    } catch (error) {
        console.error('Error accessing Redux store:', error);
    }
    
    const dispatch = useDispatch();
    
    // Simple state to track authentication status
    const [hasToken, setHasToken] = useState(false);
    
    // Check for token on initial load and storage changes
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            // Check if authenticated using our utility
            setHasToken(checkAuthenticated());
            
            // Listen for auth changes
            const handleAuthChange = () => {
                setHasToken(checkAuthenticated());
            };
            
            // Add event listeners for both storage and custom auth events
            window.addEventListener('storage', handleAuthChange);
            window.addEventListener('authChange', handleAuthChange);
            
            return () => {
                window.removeEventListener('storage', handleAuthChange);
                window.removeEventListener('authChange', handleAuthChange);
            };
        }
    }, []);
    
    // Auth server base URL
    const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:5004';

    // Logout function that calls the API
    const handleLogout = async () => {
        try {
            // Get the tokens
            const accessToken = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (accessToken && refreshToken) {
                // Get device information
                const deviceInfo = getDeviceInfo();
                
                // Call the logout API
                await axios.post(`${AUTH_SERVER_URL}/auth/logout`, 
                    { 
                        refresh_token: refreshToken,
                        device: deviceInfo 
                    },
                    { 
                        headers: { 
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        } 
                    }
                );
                
                console.log('Logout successful');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Continue with local logout even if API call fails
        } finally {
            // Clear all tokens
            clearAuthTokens();
            
            // Update local state
            setHasToken(false);
            
            // Trigger auth change event
            triggerAuthStateChange();
            
            // Remove user data
            localStorage.removeItem('user');
            
            // Close dropdown if open
            if (showDropdown) {
                setShowDropdown(false);
            }
            
            // Redirect to login page
            window.location.href = '/login?logout=true';
        }
    };

    // Use hasToken directly as our authentication status
    const userIsAuthenticated = hasToken;
    
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [lastAddedItem, setLastAddedItem] = useState(null);

    // Add state for cart count and total to ensure real-time updates
    const [localCartQuantity, setLocalCartQuantity] = useState(0);
    const [localCartTotal, setLocalCartTotal] = useState(0);
    
    // Update local cart state from Redux when it changes
    useEffect(() => {
        // Ensure we also update from initial Redux state
        console.log('Redux cart updated, new quantity:', cartQuantity, 'new total:', cartTotal);
        setLocalCartQuantity(cartQuantity);
        setLocalCartTotal(cartTotal);
    }, [cartQuantity, cartTotal]);

    // Force periodic refresh of cart data to ensure we're showing the latest
    useEffect(() => {
        // Initial update
        if (typeof window !== 'undefined') {
            // Immediately update from localStorage/redux on mount
            try {
                // Check if we have current cart data in Redux or localStorage
                const reduxQuantity = cartQuantity || 0;
                const reduxTotal = cartTotal || 0;
                
                console.log('Initial navbar cart data:', { reduxQuantity, reduxTotal });
                
                // Update our local state with whatever we have
                setLocalCartQuantity(reduxQuantity);
                setLocalCartTotal(reduxTotal);
            } catch (error) {
                console.error('Error reading initial cart data:', error);
            }
        }
        
        // Set up a refresh interval to ensure cart is always in sync
        const refreshInterval = setInterval(() => {
            if (typeof window !== 'undefined') {
                try {
                    // Update from current Redux state
                    const currentQuantity = cartQuantity || 0;
                    const currentTotal = cartTotal || 0;
                    
                    // Only update if values have changed
                    if (currentQuantity !== localCartQuantity) {
                        console.log('Refreshing cart quantity from', localCartQuantity, 'to', currentQuantity);
                        setLocalCartQuantity(currentQuantity);
                    }
                    
                    if (currentTotal !== localCartTotal) {
                        setLocalCartTotal(currentTotal);
                    }
                } catch (error) {
                    console.error('Error refreshing cart data:', error);
                }
            }
        }, 3000);
        
        return () => clearInterval(refreshInterval);
    }, []);

    // Update the cart count and total from API events with highest priority
    useEffect(() => {
        const handleCartUpdate = (event) => {
            console.log('Cart event received with details:', 
                event.detail?.cart_quantity, 
                event.detail?.cart_total
            );
            
            if (event.detail && event.detail.cart_quantity !== undefined) {
                console.log('Updating cart quantity in Navbar to:', event.detail.cart_quantity);
                setLocalCartQuantity(event.detail.cart_quantity);
            }
            if (event.detail && event.detail.cart_total !== undefined) {
                setLocalCartTotal(event.detail.cart_total);
            }
        };
        
        // Listen for both custom cart events from our hook
        window.addEventListener('cartAdd', handleCartUpdate);
        
        // Also create a direct update function we can expose globally
        if (typeof window !== 'undefined') {
            window.updateNavbarCart = handleCartUpdate;
        }
        
        return () => {
            window.removeEventListener('cartAdd', handleCartUpdate);
            if (typeof window !== 'undefined') {
                delete window.updateNavbarCart;
            }
        };
    }, []);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        
        // Set isScrolled based on whether we've scrolled at all
        setIsScrolled(latest > 0);
        
        // Only hide/show navbar after we've scrolled a bit
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    useEffect(() => {
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const handleCartAdd = (event) => {
            // Ensure navbar is visible when cart notification appears
            setHidden(false);
            
            // Log the event detail for debugging
            console.log('Cart add event received in Navbar:', event.detail);
            
            // Make sure we have complete product data
            const productData = {
                ...event.detail,
                // Ensure these fields exist with defaults if missing
                name: event.detail.name || event.detail.product_name || 'Product',
                price: parseFloat(event.detail.price || event.detail.unit_price || 0),
                image: event.detail.image || event.detail.product_image || '/assets/product_1.avif',
                quantity: event.detail.quantity || 1,
                brand_name: event.detail.brand_name || event.detail.brand || ''
            };
            
            // Update the item data with validated product information
            setLastAddedItem(productData);
            setShowCartNotification(true);
            
            // Update cart quantity and total from event with highest priority
            if (event.detail.cart_quantity !== undefined) {
                console.log('Directly updating localCartQuantity to:', event.detail.cart_quantity);
                setLocalCartQuantity(event.detail.cart_quantity);
            }
            
            if (event.detail.cart_total !== undefined) {
                setLocalCartTotal(event.detail.cart_total);
            }
            
            // Show for longer time
            setTimeout(() => setShowCartNotification(false), 6000);
        };

        window.addEventListener('cartAdd', handleCartAdd);
        return () => window.removeEventListener('cartAdd', handleCartAdd);
    }, []);

    // Get user's name from localStorage or AuthContext
    const getUserName = () => {
        // Try to get user data from localStorage first
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return userData.first_name || '';
            } catch (e) {
                console.error('Error parsing user data from localStorage:', e);
            }
        }
        
        // Fall back to AuthContext if localStorage doesn't have user data
        return user?.name || user?.first_name || '';
    };

    const userName = getUserName();
    const firstName = userName.split(' ')[0];

    // Function to check if a path matches current pathname
    const isActivePath = (path) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    // Price formatter function
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price).replace('₹', '₹ ');
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white py-6 flex items-center justify-between">
                <div className="w-[250px] h-[80px] bg-gray-100 animate-pulse rounded"></div>
                <div className="flex space-x-4">
                    <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
                    <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
                    <div className="w-20 h-8 bg-gray-100 animate-pulse rounded"></div>
                </div>
            </div>
        );
    }

    // Update the notification variants with better animations
    const notificationVariants = {
        visible: { 
            y: 0, 
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                mass: 0.8
            }
        },
        hidden: { 
            y: -30, 
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.2
            }
        }
    };

    // Item animation for the product image
    const imageVariants = {
        initial: { scale: 0.8, opacity: 0, rotateZ: -5 },
        animate: { 
            scale: 1, 
            opacity: 1, 
            rotateZ: 0,
            transition: { 
                delay: 0.1, 
                duration: 0.4,
                type: "spring",
                stiffness: 200
            }
        }
    };

    // Text animation for staggered content
    const textVariants = {
        initial: { opacity: 0, x: -10 },
        animate: (i) => ({ 
            opacity: 1, 
            x: 0,
            transition: { 
                delay: 0.1 + (i * 0.1),
                duration: 0.3
            }
        })
    };

    // Button animation
    const buttonVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { 
                delay: 0.3,
                duration: 0.3
            }
        },
        hover: { 
            scale: 1.03,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        },
        tap: { 
            scale: 0.98
        }
    };

    return (
        <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            initial="visible"
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full bg-white z-50 sticky top-0 left-0 right-0 shadow-sm"
            style={{ position: 'sticky', top: 0, zIndex: 1000 }}
        >
            <div className='w-full h-full Homepage'>
                <div className='py-6 flex items-center justify-between'>
                    <Link href='/#'>
                        <Image
                            src="/assets/logo.png"
                            alt="Aural Hearing Care Logo"
                            width={250}
                            height={80}
                            priority
                            className="object-contain"
                        />
                    </Link>
                    <div className='flex flex-row space-x-4 items-center'>
                        <ul className='flex flex-row space-x-8'>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/">
                                    <span className={`hover-underline-animation ${isActivePath('/') ? 'active-link' : ''}`}>
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/products" className={`${isActivePath('/products') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Products
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/services">
                                    <span className={`hover-underline-animation ${isActivePath('/services') ? 'active-link' : ''}`}>
                                        Services
                                    </span>
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/About-us">
                                    <span className={`hover-underline-animation ${isActivePath('/About-us') ? 'active-link' : ''}`}>
                                        About Us
                                    </span>
                                </Link>
                            </li>
                            {/* <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/online-hearing-test" className={`${isActivePath('/online-hearing-test') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Online Hearing Test
                                </Link>
                            </li> */}
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/blog" className={`${isActivePath('/blog') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Blog
                                </Link>
                            </li>
                            <li className='font-montserrat text-lg font-medium cursor-pointer relative group'>
                                <Link href="/contact" className={`${isActivePath('/contact') ? 'text-auralblue' : 'text-black'} hover-underline-animation`}>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                        <div className='h-14 rounded-xl w-[3.5px] bg-auralblue'></div>

                        <div className='flex flex-row space-x-5 pr-5 items-center'>
                            <Link href="/wishlist" className="relative">
                                <CiHeart className='text-3xl text-gray-600 cursor-pointer' />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            {userIsAuthenticated ? (
                                <Link
                                    className="relative group"
                                    href="/cart"
                                >
                                    <span className="relative flex items-center gap-1.5 cursor-pointer">
                                        <div className="relative p-2 rounded-full bg-gray-50 hover:bg-auralblue/10 transition-colors duration-300">
                                            <div className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                                {localCartQuantity}
                                            </div>
                                            <HiOutlineShoppingCart className="text-xl text-gray-700 group-hover:text-auralblue" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 group-hover:text-auralblue transition-colors duration-200">
                                            {formatPrice(localCartTotal)}
                                        </span>
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    className="relative group"
                                    href="/cart"
                                >
                                    <span className="relative flex items-center gap-1.5 cursor-pointer">
                                        <div className="relative p-2 rounded-full bg-gray-50 hover:bg-auralblue/10 transition-colors duration-300">
                                            <div className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                                {localCartQuantity}
                                            </div>
                                            <HiOutlineShoppingCart className="text-xl text-gray-700 group-hover:text-auralblue" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 group-hover:text-auralblue transition-colors duration-200">
                                            {formatPrice(localCartTotal)}
                                        </span>
                                    </span>
                                </Link>
                            )}
                            {userIsAuthenticated ? (
                                <div className="relative z-50">
                                    <CgProfile 
                                        className='text-3xl text-gray-600 cursor-pointer' 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    />
                                    {showDropdown && (
                                        <div 
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 font-montserrat font-medium text-sm z-[200] overflow-visible"
                                            style={{ 
                                                filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
                                                transform: 'translateY(0)',
                                                maxHeight: '90vh',
                                                overflowY: 'visible'
                                            }}
                                        >
                                            <div className="block px-4 py-2 text-sm text-auralblue font-medium border-b border-gray-100 font-montserrat">
                                                Hi, {firstName || 'User'}
                                            </div>
                                            <Link href="/my-info" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white font-montserrat">
                                                My Info
                                            </Link>
                                            <Link href="/my-orders" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white font-montserrat">
                                                My Orders
                                            </Link>
                                            <Link href="/saved-address" className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white">
                                                Saved Address
                                            </Link>
                                            <p className="block px-4 py-2 text-sm text-gray-700 font-medium hover:bg-auralyellow hover:text-white cursor-pointer font-montserrat" onClick={handleLogout}>
                                                Log Out 
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login">
                                    <button className='px-4 py-3 rounded-full bg-transparent text-black border-2 border-auralblue hover:bg-auralblue hover:text-white font-montserrat font-medium'>
                                        Sign In / Sign Up
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Cart Notification */}
            <AnimatePresence>
                {showCartNotification && lastAddedItem && (
                    <motion.div
                        variants={notificationVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute top-full right-4 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
                        style={{
                            background: "linear-gradient(to bottom right, #ffffff, #f9f9f9)",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.05)"
                        }}
                    >
                        {/* Success indicator */}
                        <div className="bg-gradient-to-r from-auralblue to-auralyellow h-1.5 w-full" />
                        
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center"
                                >
                                    <div className="bg-green-50 rounded-full p-1 mr-2">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800">Added to Cart</span>
                                </motion.div>
                                
                                <div className="flex items-center justify-between">
                                    <motion.button 
                                        onClick={() => setShowCartNotification(false)}
                                        className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <motion.div 
                                    variants={imageVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="relative flex-shrink-0"
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md bg-white p-1 border border-gray-100">
                                        {lastAddedItem.image ? (
                                            <img 
                                                src={lastAddedItem.image} 
                                                alt={lastAddedItem.name || 'Product'}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.target.src = '/assets/product_1.avif';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-auralblue text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium shadow-md">
                                        {lastAddedItem.quantity || 1}
                                    </div>
                                </motion.div>
                                
                                <div className="flex-1">
                                    <motion.span 
                                        custom={0}
                                        variants={textVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="text-xs font-semibold text-auralblue uppercase block mb-1"
                                    >
                                        {lastAddedItem.brand_name || lastAddedItem.brand || 'Product'}
                                    </motion.span>
                                    
                                    <motion.h3 
                                        custom={1}
                                        variants={textVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="font-medium text-gray-900 leading-tight mb-1"
                                    >
                                        {lastAddedItem.name || 'Item Added to Cart'}
                                    </motion.h3>
                                    
                                    <motion.div 
                                        custom={2}
                                        variants={textVariants}
                                        initial="initial"
                                        animate="animate"
                                        className="flex items-center mt-1"
                                    >
                                        <span className="text-lg font-bold text-auralblue">
                                            ₹{(lastAddedItem.discounted_price || lastAddedItem.price || 0).toLocaleString('en-IN')}
                                        </span>
                                        {lastAddedItem.discounted_price && lastAddedItem.price && lastAddedItem.discounted_price < lastAddedItem.price && (
                                            <span className="ml-2 text-xs text-gray-500 line-through">
                                                ₹{lastAddedItem.price.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex gap-3 items-center">
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="flex-1"
                                    >
                                        <Link 
                                            href="/cart" 
                                            className="block w-full bg-gradient-to-r from-auralblue to-auralblue/90 text-white py-2.5 rounded-lg font-medium text-center text-sm hover:from-auralblue/90 hover:to-auralblue transition-all duration-300 shadow-md hover:shadow-lg"
                                            onClick={() => setShowCartNotification(false)}
                                        >
                                            View Cart ({localCartQuantity})
                                        </Link>
                                    </motion.div>
                                    
                                    <motion.button
                                        variants={buttonVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="px-4 py-2.5 bg-gradient-to-r from-auralyellow to-auralyellow/90 text-white rounded-lg text-sm font-medium hover:from-auralyellow/90 hover:to-auralyellow transition-all duration-300 shadow-md hover:shadow-lg"
                                        onClick={() => setShowCartNotification(false)}
                                    >
                                        Continue
                                    </motion.button>
                                </div>
                            
                                {localCartQuantity > 1 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                                        className="mt-3 pt-0"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-600">
                                                Cart Subtotal ({localCartQuantity} {localCartQuantity === 1 ? 'item' : 'items'})
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatPrice(localCartTotal)}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Navbar

