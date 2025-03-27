'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { reduxLogin } from '@/store/authSlice';
import { toast } from 'react-hot-toast';
import OTPVerification from '@/Components/Auth/OTPVerification';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { AiFillApple } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { setAuthToken, triggerAuthStateChange, clearAuthTokens, getDeviceInfo } from '@/utils/auth';
import useCart from '@/hooks/useCart';
import SearchParamsProvider from '@/Components/SearchParamsProvider';

// Auth server base URL
const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:5004';

// Main Login component wrapped in Suspense
export default function LoginPage() {
  return (
    <SearchParamsProvider>
      <Login />
    </SearchParamsProvider>
  );
}

// Actual Login component implementation
function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 relative overflow-hidden">
            {/* Back to homepage link */}
            <div className="absolute top-4 left-4 z-50">
                <Link href="/">
                    <button className="flex items-center gap-2 text-auralblue hover:text-auralyellow transition-colors bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                        <FaArrowLeft />
                        <span className="font-medium">Back to Home</span>
                    </button>
                </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Top left circle */}
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
                
                {/* Bottom right circle */}
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-100 rounded-full opacity-50 blur-3xl"></div>
                
                {/* Middle accent */}
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-50 rounded-full opacity-40 blur-3xl"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                
                {/* Floating elements */}
                <div className="absolute inset-0">
                    {/* Floating circles */}
                    <div className="floating-element absolute h-6 w-6 rounded-full bg-blue-200 opacity-60 top-1/4 left-1/4" style={{ animationDelay: '0s', animationDuration: '15s' }}></div>
                    <div className="floating-element absolute h-4 w-4 rounded-full bg-indigo-200 opacity-60 top-1/3 right-1/3" style={{ animationDelay: '2s', animationDuration: '18s' }}></div>
                    <div className="floating-element absolute h-8 w-8 rounded-full bg-teal-200 opacity-50 bottom-1/4 right-1/4" style={{ animationDelay: '1s', animationDuration: '20s' }}></div>
                    
                    {/* Floating squares */}
                    <div className="floating-element absolute h-5 w-5 rotate-45 bg-blue-100 opacity-60 top-2/3 left-1/5" style={{ animationDelay: '3s', animationDuration: '17s' }}></div>
                    <div className="floating-element absolute h-7 w-7 rotate-12 bg-indigo-100 opacity-50 top-1/2 right-1/5" style={{ animationDelay: '4s', animationDuration: '22s' }}></div>
                </div>
                
                {/* Wave effect at bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg className="relative block w-full h-[60px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,136.33,111.31,213.25,91.5c31.83-8.15,62.6-18.64,97.95-24.32A536.35,536.35,0,0,1,321.39,56.44Z" className="fill-blue-50/50"></path>
                        <path d="M985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,136.33,111.31,213.25,91.5c31.83-8.15,62.6-18.64,97.95-24.32A536.35,536.35,0,0,1,321.39,56.44C380.76,45.42,438.39,25.54,496.5,13.23,568.47-3.29,642.45-4.77,712.14,7.49c62.95,11.13,120.4,31.09,183.52,48.33Z" className="fill-indigo-50/60 wave-animation"></path>
                    </svg>
                </div>
            </div>
            
            <LoginContent />
            
            <style jsx global>{`
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, #9ca3af 1px, transparent 1px),
                                    linear-gradient(to bottom, #9ca3af 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                
                @keyframes float {
                    0% {
                        transform: translateY(0px) translateX(0px);
                    }
                    25% {
                        transform: translateY(-10px) translateX(10px);
                    }
                    50% {
                        transform: translateY(0px) translateX(20px);
                    }
                    75% {
                        transform: translateY(10px) translateX(10px);
                    }
                    100% {
                        transform: translateY(0px) translateX(0px);
                    }
                }
                
                .floating-element {
                    animation: float infinite ease-in-out;
                }
                
                @keyframes wave {
                    0% {
                        transform: translateX(0) translateZ(0);
                    }
                    50% {
                        transform: translateX(-25px) translateZ(0);
                    }
                    100% {
                        transform: translateX(0) translateZ(0);
                    }
                }
                
                .wave-animation {
                    animation: wave 15s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const router = useRouter();
    const dispatch = useDispatch();
    const { mergeGuestCart } = useCart();

    // Check for logout query parameter and clear tokens if present
    useEffect(() => {
        // Get URL search params
        const searchParams = new URLSearchParams(window.location.search);
        const logoutParam = searchParams.get('logout');
        
        // If user came from logout, make sure tokens are cleared
        if (logoutParam === 'true') {
            clearAuthTokens();
            triggerAuthStateChange();
        }
        
        // Check for remembered email
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Get device information
            const deviceInfo = getDeviceInfo();
            
            // Make a direct API call to the login endpoint
            const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/login`, {
                email,
                password,
                device: deviceInfo
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Login response:', response.data);
            
            if (response.data.success) {
                // Extract user and token data from response
                const { user, tokens } = response.data.data;
                const { access_token, refresh_token } = tokens;
                
                // Store tokens using our utility function
                setAuthToken(access_token);
                localStorage.setItem('refresh_token', refresh_token);
                
                // Store user data if needed
                localStorage.setItem('user', JSON.stringify(user));
                
                // Store email in localStorage if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Dispatch to Redux if needed
                try {
                    dispatch(reduxLogin({ 
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        userId: user.id
                    }));
                } catch (reduxError) {
                    console.error('Redux dispatch error:', reduxError);
                }
                
                // Trigger auth state change to update components
                triggerAuthStateChange();
                
                // Check if there's a guest cart that needs to be merged
                const shouldMergeCart = localStorage.getItem('should_merge_cart');
                if (shouldMergeCart === 'true') {
                    console.log('Attempting to merge guest cart after login');
                    try {
                        const mergeResult = await mergeGuestCart();
                        if (mergeResult.success) {
                            toast.success('Your cart items have been added to your account');
                        } else {
                            console.warn('Cart merge was not successful:', mergeResult.message);
                        }
                    } catch (mergeError) {
                        console.error('Error merging carts after login:', mergeError);
                    } finally {
                        // Remove the flag regardless of the result
                        localStorage.removeItem('should_merge_cart');
                    }
                }
                
                toast.success('Login successful!');
                
                // Check for redirect URL from query parameters first
                const searchParams = new URLSearchParams(window.location.search);
                const redirectParam = searchParams.get('redirect');
                
                // Then check for stored redirect URL
                const storedRedirectUrl = localStorage.getItem('redirectAfterLogin');
                
                // Determine the final redirect URL with priority order
                const finalRedirectUrl = redirectParam 
                    ? decodeURIComponent(redirectParam)
                    : storedRedirectUrl 
                    ? storedRedirectUrl 
                    : '/';
                
                // Clear any stored redirect
                localStorage.removeItem('redirectAfterLogin');
                
                // Redirect the user
                window.location.href = finalRedirectUrl;
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // Check if the error is due to unverified email
            if (error.response?.data?.message?.includes('not verified')) {
                setVerificationEmail(email);
                setShowOTPVerification(true);
            } else {
                toast.error(error.response?.data?.message || 'Login failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSuccess = async () => {
        toast.success('Email verified successfully! Redirecting to home page...');
        
        try {
            // Try to log in with the verified email
            const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/login`, {
                email: verificationEmail,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                // Extract user and token data from response
                const { user, tokens } = response.data.data;
                const { access_token, refresh_token } = tokens;
                
                // Store tokens using our utility function
                setAuthToken(access_token);
                localStorage.setItem('refresh_token', refresh_token);
                
                // Store user data if needed
                localStorage.setItem('user', JSON.stringify(user));
                
                // Trigger auth state change to update components
                triggerAuthStateChange();
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                console.error('Login failed after verification');
                toast.error(response.data.message || 'Login failed after verification');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error during verification success handling:', error);
            toast.error('Error logging in after verification. Please try again.');
            router.push('/login');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            {showOTPVerification ? (
                <OTPVerification 
                    email={verificationEmail} 
                    onVerified={handleVerificationSuccess}
                    onResend={() => toast.success('New verification code sent!')}
                />
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10"
                >
                    <div className="bg-white/95 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl border border-gray-100 relative overflow-hidden shine-effect">
                        {/* Shine overlay */}
                        <div className="absolute -inset-[400px] shine-animation"></div>
                        
                        <div className="relative z-10">
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome Back</h2>
                                <p className="text-sm sm:text-base text-gray-600">Sign in to your account</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                <input 
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                            className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                            placeholder="Enter your email"
                                />
                            </div>
                            </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                <input 
                                            id="password"
                                            name="password"
                                    type={showPassword ? "text" : "password"} 
                                            autoComplete="current-password"
                                            required
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                            className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                            placeholder="Enter your password"
                                />
                                        <button
                                            type="button"
                                    onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                                            ) : (
                                                <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 text-auralblue focus:ring-auralblue border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-xs sm:text-sm">
                                        <a href="#" className="font-medium text-auralblue hover:text-blue-600 transition-colors duration-200">
                                            Forgot your password?
                                        </a>
                                    </div>
                            </div>

                                <div>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auralblue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auralblue transition-colors duration-200"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </div>
                                        ) : (
                                            "Sign in"
                                        )}
                                    </motion.button>
                                </div>
                            </form>

                            <div className="mt-5 sm:mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs sm:text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <a
                                            href="#"
                                            className="w-full inline-flex justify-center py-2 sm:py-3 px-2 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <FcGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="ml-1 sm:ml-2">Google</span>
                                        </a>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <a
                                            href="#"
                                            className="w-full inline-flex justify-center py-2 sm:py-3 px-2 sm:px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <AiFillApple className="h-4 w-4 sm:h-5 sm:w-5" />
                                            <span className="ml-1 sm:ml-2">Apple</span>
                                        </a>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6 text-center">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link href="/signup" className="font-medium text-auralblue hover:text-blue-600 transition-colors duration-200">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
