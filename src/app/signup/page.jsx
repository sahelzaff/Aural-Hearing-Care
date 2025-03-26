'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import OTPVerification from '@/Components/Auth/OTPVerification';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { AiFillApple } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { setAuthToken, triggerAuthStateChange } from '@/utils/auth';

// Auth server base URL
const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:5004';

export default function Signup() {
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
      
      <SignupContent />
      
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
        
        .shine-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shine-animation {
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.2), 
            transparent
          );
          transform: skewX(-20deg);
          animation: shine 8s infinite;
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          20%, 100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function SignupContent() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const router = useRouter();
    
    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    
    // Validate password on change
    useEffect(() => {
        const { password } = formData;
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        });
    }, [formData.password]);
    
    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user begins typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    // Handle step 1 validation and navigation
    const handleNextStep = () => {
        // If current step is step 1 (Basic Details)
        if (currentStep === 1) {
            const stepErrors = {};
            if (!formData.firstName.trim()) stepErrors.firstName = 'First name is required';
            if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
            if (!formData.email.trim()) stepErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = 'Invalid email format';
            if (!formData.gender) stepErrors.gender = 'Please select a gender';
            
            if (Object.keys(stepErrors).length === 0) {
                setCurrentStep(2);
            } else {
                setErrors(stepErrors);
            }
        }
        // If current step is step 2 (Security)
        else if (currentStep === 2) {
            const stepErrors = {};
            if (!formData.phone) stepErrors.phone = 'Phone number is required';
            if (!formData.password) stepErrors.password = 'Password is required';
            else if (!passwordValidation.length || !passwordValidation.uppercase || 
                    !passwordValidation.number || !passwordValidation.special) {
                stepErrors.password = 'Password does not meet requirements';
            }
            if (!formData.confirmPassword) stepErrors.confirmPassword = 'Please confirm your password';
            else if (!passwordsMatch) stepErrors.confirmPassword = 'Passwords do not match';
            
            if (Object.keys(stepErrors).length > 0) {
                setErrors(stepErrors);
                return;
            }
            
            // Send registration request and proceed to OTP step
            handleRegistration();
        }
    };
    
    // If at OTP verification step, don't allow going back
    const handlePrevStep = () => {
        // Only allow going back if not in the OTP verification step
        if (currentStep > 1 && currentStep !== 3) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    // Check if passwords match
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
    
    // Handle registration request and proceed to OTP step
    const handleRegistration = async () => {
        setIsLoading(true);
        
        try {
            // Prepare the user data in the format expected by the auth server
            const userData = {
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone,
                gender: formData.gender
            };
            
            // Register the user with the auth server
            const response = await axios.post(
                `${AUTH_SERVER_URL}/api/auth/register`, 
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Registration response:', response);
            
            // Check if registration was successful (status 201)
            if (response.status === 201 && response.data.success) {
                // Store the auth tokens
                const { access_token, refresh_token } = response.data.data.tokens;
                
                // Store token using our utility function
                setAuthToken(access_token);
                localStorage.setItem('refresh_token', refresh_token);
                
                // Store user data if needed
                const userData = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                
                // Trigger auth state change
                triggerAuthStateChange();
                
                // Store email for verification
                setVerificationEmail(formData.email);
                setOtpSent(true);
                setCurrentStep(3);
                toast.success('Registration successful! Please verify your email with OTP.');
            } else {
                toast.error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep === 1 || currentStep === 2) {
            handleNextStep();
        }
    };
    
    // Handle successful email verification
    const handleVerificationSuccess = async () => {
        toast.success('Email verified successfully! Redirecting to home page...');
        
        try {
            // Get the access token from localStorage
            const token = localStorage.getItem('access_token');
            
            if (token) {
                // Set as authToken for compatibility with the rest of the app
                setAuthToken(token);
                
                // Trigger auth state change
                triggerAuthStateChange();
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                console.error('No access token found');
                router.push('/login');
            }
        } catch (error) {
            console.error('Error during verification success handling:', error);
            router.push('/login');
        }
    };
    
    // Handle OTP verification
    const handleVerifyOTP = async (otp) => {
        try {
            const response = await axios.post(
                `${AUTH_SERVER_URL}/api/auth/verify-email`,
                {
                    email: verificationEmail,
                    otp: otp
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                return true;
            } else {
                toast.error(response.data.message || 'OTP verification failed');
                return false;
            }
        } catch (error) {
            console.error('OTP verification error:', error);
            toast.error(error.response?.data?.message || 'OTP verification failed');
            return false;
        }
    };
    
    // Handle OTP resend
    const handleResendOTP = async () => {
        try {
            const response = await axios.post(
                `${AUTH_SERVER_URL}/api/auth/resend-verification`,
                {
                    email: verificationEmail
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                toast.success('New verification code sent!');
                return true;
            } else {
                toast.error(response.data.message || 'Failed to resend verification code');
                return false;
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error(error.response?.data?.message || 'Failed to resend verification code');
            return false;
        }
    };
    
    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    // Toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    
    // Password validation component
    const ValidationItem = ({ isValid, text }) => (
        <div className="flex items-center space-x-2 text-xs">
            <span className={`flex items-center justify-center h-4 w-4 rounded-full ${isValid ? 'text-green-500' : 'text-red-500'}`}>
                {isValid ? <FaCheck className="h-3 w-3" /> : <FaTimes className="h-3 w-3" />}
            </span>
            <span>{text}</span>
        </div>
    );

    // After entering OTP verification step, prevent going back and handle navigation
    useEffect(() => {
        if (currentStep === 3) {
            // Use POST-redirect-GET pattern by adding form state to URL
            // This helps prevent form resubmission issues
            window.history.replaceState(
                { formStep: 'verification', email: verificationEmail }, 
                '', 
                window.location.pathname + '?step=verification'
            );
            
            // Disable browser back button for OTP verification step
            const preventBackNavigation = (e) => {
                // Show browser's default confirmation dialog when trying to leave
                e.preventDefault();
                e.returnValue = 'Changes you made may not be saved. Are you sure you want to leave this page?';
                return e.returnValue;
            };
            
            // Add the beforeunload event listener to prevent accidental navigation
            window.addEventListener('beforeunload', preventBackNavigation);
            
            // Function to handle popstate (when user clicks browser back button)
            const handlePopState = (e) => {
                // Prevent going back by pushing another state
                window.history.pushState(
                    { formStep: 'verification', email: verificationEmail }, 
                    '', 
                    window.location.pathname + '?step=verification'
                );
                
                // Show a custom warning toast
                toast.error('Please complete the verification process or reload the page to restart.');
                
                // If they insist on going back, force a page reload to reset everything
                const userWantsToGoBack = window.confirm(
                    'Going back will reset the registration process. Do you want to start over?'
                );
                
                if (userWantsToGoBack) {
                    window.location.href = window.location.pathname; // Reload the page without query params
                }
            };
            
            // Add the popstate event listener
            window.addEventListener('popstate', handlePopState);
            
            // Cleanup function
            return () => {
                window.removeEventListener('beforeunload', preventBackNavigation);
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [currentStep, verificationEmail]);

    if (isLoading && currentStep !== 3) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auralblue"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative z-10"
            >
                <div className="bg-white/95 backdrop-blur-sm py-6 sm:py-8 px-4 sm:px-6 shadow-xl rounded-xl border border-gray-100 relative overflow-hidden shine-effect">
                    {/* Shine overlay */}
                    <div className="absolute -inset-[400px] shine-animation"></div>
                    
                    <div className="relative z-10">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Create Account</h2>
                            <p className="text-sm sm:text-base text-gray-600">Register for appointments and hearing solutions</p>
                        </div>
                        
                        {/* Step indicator */}
                        <div className="flex justify-center mb-6">
                            <div className="flex items-center w-80 sm:w-96">
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${currentStep >= 1 ? 'bg-auralblue text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    <span className="text-sm font-medium">1</span>
                                </div>
                                <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? 'bg-auralblue' : 'bg-gray-300'}`}></div>
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${currentStep >= 2 ? 'bg-auralblue text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    <span className="text-sm font-medium">2</span>
                                </div>
                                <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? 'bg-auralblue' : 'bg-gray-300'}`}></div>
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${currentStep >= 3 ? 'bg-auralblue text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    <span className="text-sm font-medium">3</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Step labels */}
                        <div className="flex justify-center mb-8">
                            <div className="grid grid-cols-3 w-80 sm:w-96 text-xs sm:text-sm">
                                <div className="text-center">
                                    <span className={`font-medium ${currentStep >= 1 ? 'text-auralblue' : 'text-gray-500'}`}>Basic Details</span>
                                </div>
                                <div className="text-center">
                                    <span className={`font-medium ${currentStep >= 2 ? 'text-auralblue' : 'text-gray-500'}`}>Security</span>
                                </div>
                                <div className="text-center">
                                    <span className={`font-medium ${currentStep >= 3 ? 'text-auralblue' : 'text-gray-500'}`}>OTP</span>
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {currentStep === 1 ? (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        {/* First name and Last name in same row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="firstName"
                                                        name="firstName"
                                                        type="text"
                                                        required
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                        placeholder="Enter your first name"
                                                    />
                                                </div>
                                                {errors.firstName && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="lastName"
                                                        name="lastName"
                                                        type="text"
                                                        required
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                        placeholder="Enter your last name"
                                                    />
                                                </div>
                                                {errors.lastName && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Email Address */}
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
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                    placeholder="Enter your email"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                        
                                        {/* Gender */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Gender
                                            </label>
                                            <div className="grid grid-cols-3 gap-3">
                                                <div
                                                    className={`border ${formData.gender === 'Male' ? 'bg-auralblue text-white border-auralblue' : 'bg-white text-gray-700 border-gray-300'} rounded-md py-2 sm:py-3 text-center cursor-pointer transition-colors duration-200 text-sm sm:text-base`}
                                                    onClick={() => handleChange({ target: { name: 'gender', value: 'Male' } })}
                                                >
                                                    Male
                                                </div>
                                                <div
                                                    className={`border ${formData.gender === 'Female' ? 'bg-auralblue text-white border-auralblue' : 'bg-white text-gray-700 border-gray-300'} rounded-md py-2 sm:py-3 text-center cursor-pointer transition-colors duration-200 text-sm sm:text-base`}
                                                    onClick={() => handleChange({ target: { name: 'gender', value: 'Female' } })}
                                                >
                                                    Female
                                                </div>
                                                <div
                                                    className={`border ${formData.gender === 'Other' ? 'bg-auralblue text-white border-auralblue' : 'bg-white text-gray-700 border-gray-300'} rounded-md py-2 sm:py-3 text-center cursor-pointer transition-colors duration-200 text-sm sm:text-base`}
                                                    onClick={() => handleChange({ target: { name: 'gender', value: 'Other' } })}
                                                >
                                                    Other
                                                </div>
                                            </div>
                                            {errors.gender && (
                                                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                            )}
                                        </div>
                                        
                                        {/* Continue button for step 1 */}
                                        <div>
                                            <motion.button
                                                type="button"
                                                onClick={handleNextStep}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auralblue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auralblue transition-colors duration-200"
                                            >
                                                Continue
                                            </motion.button>
                                        </div>
                                        
                                        {/* Social login options for step 1 */}
                                        <div className="mt-4 sm:mt-6">
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
                                    </motion.div>
                                ) : currentStep === 2 ? (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        {/* Back button for step 2 */}
                                        <div className="mb-2">
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="flex items-center text-sm font-medium text-gray-600 hover:text-auralblue transition-colors duration-200"
                                            >
                                                <FaArrowLeft className="mr-1 h-3 w-3" /> Back
                                            </button>
                                        </div>
                                        
                                        {/* Phone Number */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <div className="relative">
                                                <PhoneInput
                                                    country={'in'}
                                                    value={formData.phone}
                                                    onChange={(phone) => handleChange({ target: { name: 'phone', value: phone } })}
                                                    inputProps={{
                                                        id: 'phone',
                                                        name: 'phone',
                                                        required: true,
                                                        className: "appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                    }}
                                                    containerClass="w-full"
                                                    inputClass="w-full"
                                                    buttonClass="border-none"
                                                    dropdownClass="shadow-lg rounded-md border border-gray-200"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>
                                        
                                        {/* Password */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onFocus={() => setIsPasswordFocused(true)}
                                                    onBlur={() => setIsPasswordFocused(false)}
                                                    className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                    placeholder="Create a password"
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
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                            )}
                                            
                                            {/* Password validation */}
                                            {isPasswordFocused && (
                                                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200 text-xs sm:text-sm">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <ValidationItem isValid={passwordValidation.length} text="At least 8 characters" />
                                                        <ValidationItem isValid={passwordValidation.uppercase} text="One uppercase letter" />
                                                        <ValidationItem isValid={passwordValidation.number} text="One number" />
                                                        <ValidationItem isValid={passwordValidation.special} text="One special character" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Confirm Password */}
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="appearance-none block w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-auralblue focus:border-auralblue transition-all duration-200 text-gray-900 text-sm sm:text-base"
                                                    placeholder="Confirm your password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleConfirmPasswordVisibility}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                                >
                                                    {showConfirmPassword ? (
                                                        <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    ) : (
                                                        <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                            )}
                                            
                                            {/* Password match indicator */}
                                            {formData.confirmPassword && (
                                                <div className={`mt-1 text-sm flex items-center ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                                    {passwordsMatch ? (
                                                        <>
                                                            <FaCheck className="mr-1 h-3 w-3" /> Passwords match
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaTimes className="mr-1 h-3 w-3" /> Passwords don't match
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Continue button for step 2 */}
                                        <div>
                                            <motion.button
                                                type="button"
                                                onClick={handleNextStep}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={isLoading}
                                                className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auralblue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auralblue transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    "Continue to Verification"
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        {/* OTP Verification step - No back button */}
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Verify Your Email</h3>
                                            <p className="text-sm text-gray-600">
                                                We've sent a verification code to {verificationEmail}
                                            </p>
                                        </div>
                                        
                                        <OTPVerification 
                                            email={verificationEmail} 
                                            onVerified={handleVerificationSuccess}
                                            onResend={handleResendOTP}
                                            verifyOtp={handleVerifyOTP}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                        
                        <div className="mt-5 sm:mt-6 text-center">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-auralblue hover:text-blue-600 transition-colors duration-200">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 