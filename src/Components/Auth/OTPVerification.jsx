import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

// Auth server base URL
const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_URL || 'http://localhost:5004';

const OTPVerification = ({ email, onVerified, onResend, verifyOtp }) => {
  // Use a try-catch block to handle potential errors with AuthContext
  let authContextValue = { 
    verifyEmail: async (email, otp) => {
      try {
        const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/verify-email`, { 
          email, 
          otp 
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data.success;
      } catch (error) {
        console.error('Verification error:', error);
        return false;
      }
    }
  };
  
  try {
    const contextValue = useContext(AuthContext);
    if (contextValue && contextValue.verifyEmail) {
      authContextValue = contextValue;
    }
  } catch (error) {
    console.error('Error using AuthContext:', error);
  }
  
  // Destructure values from authContextValue
  const { verifyEmail } = authContextValue;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    if (value && index === 5 && newOtp.every(digit => digit)) {
      handleVerify();
    }
  };

  // Handle key press
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5].focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    if (otp.some(digit => !digit)) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    if (isVerifying) return;
    
    setIsVerifying(true);
    
    try {
      let success = false;
      
      // Use provided verifyOtp function if available (for direct API calls)
      if (typeof verifyOtp === 'function') {
        success = await verifyOtp(otp.join(''));
      } else {
        // Use the default method
        const verifyResponse = await axios.post(`${AUTH_SERVER_URL}/api/auth/verify-email`, {
          email,
          otp: otp.join('')
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        success = verifyResponse.data.success;
        
        if (success && verifyResponse.data.token) {
          localStorage.setItem('authToken', verifyResponse.data.token);
        }
      }
      
      if (success) {
        toast.success('Email verified successfully!');
        
        // Force an update to the auth state by dispatching an event
        window.dispatchEvent(new Event('storage'));
        
        if (onVerified) {
          onVerified();
        } else {
          toast.success('Authentication successful! Redirecting to home page...');
          setTimeout(() => {
            // Force a full page reload to ensure all components recognize the auth state
            window.location.href = '/';
          }, 1000);
        }
      } else {
        setAttempts(prev => prev + 1);
        toast.error('Verification failed. Please check your OTP and try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setAttempts(prev => prev + 1);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      
      if (!navigator.onLine) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (isResending) return;
    
    setIsResending(true);
    
    try {
      // Use the provided resend function if available
      if (typeof onResend === 'function' && typeof onResend() === 'object' && onResend().then) {
        const success = await onResend();
        if (success) {
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0].focus();
          setTimeLeft(600);
          setAttempts(0);
        }
      } else {
        // Use the default method
        const response = await axios.post(`${AUTH_SERVER_URL}/api/auth/resend-verification`, {
          email
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          toast.success('New verification code sent!');
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0].focus();
          
          if (response.data.expiresAt) {
            const expiresAt = new Date(response.data.expiresAt).getTime();
            const now = new Date().getTime();
            const timeLeftInSeconds = Math.floor((expiresAt - now) / 1000);
            setTimeLeft(timeLeftInSeconds > 0 ? timeLeftInSeconds : 600);
          } else {
            setTimeLeft(600);
          }
          
          setAttempts(0);
          // Call the original onResend if it's just a notification function
          if (typeof onResend === 'function' && typeof onResend() !== 'object') {
            onResend();
          }
        } else {
          toast.error(response.data.message || 'Failed to resend code');
        }
      }
    } catch (error) {
      console.error('Resend error:', error);
      
      if (!navigator.onLine) {
        toast.error('Network error. Please check your internet connection.');
        return;
      }
      
      const errorResponse = error.response?.data;
      
      if (errorResponse) {
        if (errorResponse.message?.toLowerCase().includes('rate limit') || 
            errorResponse.message?.toLowerCase().includes('too many requests')) {
          toast.error('Too many requests. Please try again later.');
          return;
        }
        
        if (errorResponse.message?.toLowerCase().includes('already verified')) {
          toast.success('Email is already verified!');
          onVerified && onVerified();
          return;
        }
        
        toast.error(errorResponse.message || 'Failed to resend code');
      } else {
        toast.error('Failed to resend code. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  // Effect to handle form resubmission and browser back button
  useEffect(() => {
    // Force browser to show confirmation dialog on page leave/refresh
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Add a history state to handle browser back button
    window.history.pushState(null, '', window.location.pathname);
    
    // Handle browser back button attempts
    const handlePopState = () => {
      // Push another state to prevent going back
      window.history.pushState(null, '', window.location.pathname);
      toast.error('Please complete the verification process or refresh the page to start over.');
    };
    
    // Listen for back button clicks
    window.addEventListener('popstate', handlePopState);
    
    // Clean up
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Verify Your Email
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        We've sent a verification code to <span className="font-medium">{email}</span>
      </p>
      
      <div className="flex justify-center space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : null}
            className="w-12 h-14 text-center text-xl font-semibold border-2 rounded-md focus:border-auralblue focus:outline-none"
          />
        ))}
      </div>
      
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">
            Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
          {attempts > 0 && (
            <p className="text-sm text-orange-500">
              Attempts: <span className="font-medium">{attempts}</span>
            </p>
          )}
        </div>
        
        {timeLeft > 0 ? (
          <motion.button
            onClick={handleVerify}
            disabled={isVerifying || otp.some(digit => !digit)}
            className="w-full py-3 px-4 bg-auralblue text-white rounded-md font-medium transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            whileHover={{ scale: isVerifying || otp.some(digit => !digit) ? 1 : 1.02 }}
            whileTap={{ scale: isVerifying || otp.some(digit => !digit) ? 1 : 0.98 }}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </motion.button>
        ) : (
          <div className="text-center">
            <p className="text-red-500 font-medium mb-2">
              Verification code expired
            </p>
            <p className="text-sm text-gray-600">
              Please request a new code below
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        
        <motion.button
          onClick={handleResend}
          disabled={isResending || timeLeft > 540}
          className="text-auralblue font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          whileHover={{ scale: isResending || timeLeft > 540 ? 1 : 1.05 }}
        >
          {isResending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-auralblue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Resend Code'
          )}
        </motion.button>
        
        {timeLeft > 540 && (
          <p className="text-xs text-gray-500 mt-1">
            You can request a new code in {formatTime(timeLeft - 540)}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default OTPVerification;