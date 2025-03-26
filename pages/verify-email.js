import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import OTPVerification from '../src/Components/Auth/OTPVerification';
import { toast } from 'react-hot-toast';
import AuthContext from '../src/context/AuthContext';

export default function VerifyEmail() {
  // Use a try-catch block to handle potential errors with AuthContext
  let authContextValue = { isAuthenticated: false };
  
  try {
    const contextValue = useContext(AuthContext);
    if (contextValue) {
      authContextValue = contextValue;
    }
  } catch (error) {
    console.error('Error using AuthContext:', error);
  }
  
  // Destructure values from authContextValue
  const { isAuthenticated } = authContextValue;
  const router = useRouter();
  const { email } = router.query;
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/');
      return;
    }
    
    // Get email from query params or localStorage
    if (email) {
      setUserEmail(email);
      setIsLoading(false);
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        setUserEmail(storedEmail);
        setIsLoading(false);
      } else {
        // No email found, redirect to login
        toast.error('No email found for verification. Please log in.');
        router.replace('/login');
      }
    }
  }, [email, router, isAuthenticated]);

  const handleVerificationSuccess = () => {
    toast.success('Email verified successfully! Redirecting to home page...');
    
    // Log the token
    const token = localStorage.getItem('authToken');
    console.log('verify-email.js - Token before redirect:', token ? `${token.substring(0, 10)}...` : 'No token');
    
    if (!token) {
      console.error('No token found after verification');
      
      // Try to get a token from the tempPassword
      const storedEmail = localStorage.getItem('userEmail') || userEmail;
      const password = localStorage.getItem('tempPassword');
      
      if (storedEmail && password) {
        console.log('Attempting login with stored credentials');
        
        // Make a direct API call to login
        fetch('http://localhost:5003/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: storedEmail,
            password
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log('Login response:', data);
          
          if (data.success && data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Token set after login:', data.token.substring(0, 10) + '...');
            
            // Redirect to home page
            window.location.href = '/';
          } else {
            console.error('Login failed:', data);
            toast.error('Authentication failed. Please try logging in manually.');
            router.push('/login');
          }
        })
        .catch(error => {
          console.error('Login error:', error);
          toast.error('Authentication failed. Please try logging in manually.');
          router.push('/login');
        });
      } else {
        toast.error('Authentication failed. Please try logging in manually.');
        router.push('/login');
      }
    } else {
      // Add a small delay to ensure the state is updated
      setTimeout(() => {
        // Use window.location.href for a full page reload
        window.location.href = '/';
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auralblue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to your email
          </p>
        </div>
        
        <OTPVerification 
          email={userEmail} 
          onVerified={handleVerificationSuccess}
          onResend={() => toast.success('New verification code sent!')}
        />
        
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-auralblue hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
} 