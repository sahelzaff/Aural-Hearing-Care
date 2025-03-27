import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import '../src/app/globals.css';

// Import AuthContext from the separate file
import AuthContext from '../src/context/AuthContext';

// Safe localStorage access
const getStorageItem = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set up axios interceptors and fetch user on mount
  useEffect(() => {
    // Debug token storage
    const token = getStorageItem('authToken') || getStorageItem('access_token');
    console.log('_app.js - Token in localStorage:', token ? `${token.substring(0, 10)}...` : 'No token');
    
    // Configure axios defaults
    axios.defaults.baseURL = 'http://localhost:5003/api';
    
    // Set up request interceptor to add token to all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Get the token from localStorage on each request to ensure we have the latest
        const token = getStorageItem('authToken');
        if (token) {
          console.log('Adding token to request:', config.url);
          config.headers.Authorization = `Bearer ${token}`;
          
          // Log the token being used (first 10 chars for security)
          const tokenPreview = token.substring(0, 10) + '...';
          console.log('Using token:', tokenPreview);
        } else {
          console.log('No token available for request:', config.url);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Set up response interceptor to handle auth errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized request detected');
          // Only redirect to login if not already on login or signup page
          if (
            !router.pathname.includes('/login') && 
            !router.pathname.includes('/signup') &&
            !router.pathname.includes('/verify-email')
          ) {
            toast.error('Session expired. Please log in again.');
            removeStorageItem('authToken');
            setUser(null); // Ensure user state is cleared
            router.push('/login');
          }
        }
        return Promise.reject(error);
      }
    );
    
    // Function to fetch the current user
    const fetchCurrentUser = async () => {
      try {
        // Get the token from localStorage
        const token = getStorageItem('authToken') || getStorageItem('access_token');
        
        // If no token, we're not authenticated
        if (!token) {
          console.log('_app.js - No token found, setting user to null');
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('_app.js - Fetching current user with token:', token.substring(0, 10) + '...');
        
        try {
          // First try the new auth server endpoint
          const response = await axios.get('http://localhost:5004/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (response.data && response.data.success) {
            console.log('_app.js - User data from new auth server:', response.data);
            setUser(response.data.data.user);
          } else {
            throw new Error('Failed to get user data from new auth server');
          }
        } catch (newApiError) {
          console.error('Error fetching from new auth server:', newApiError);
          
          // Fall back to the old endpoint
          try {
            const oldResponse = await axios.get('/users/me', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (oldResponse.data && oldResponse.data.user) {
              console.log('_app.js - User data from old auth server:', oldResponse.data);
              setUser(oldResponse.data.user);
            } else {
              throw new Error('Failed to get user data from old auth server');
            }
          } catch (oldApiError) {
            console.error('Error fetching from old auth server:', oldApiError);
            
            // If both fail, assume token is invalid
            console.error('All API endpoints failed, clearing token');
            removeStorageItem('authToken');
            removeStorageItem('access_token');
            removeStorageItem('refresh_token');
            setUser(null);
            
            // Trigger auth state update
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new CustomEvent('authChange'));
            }
          }
        }
      } catch (error) {
        console.error('_app.js - Error fetching current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    // Function to handle authentication state changes
    const handleAuthChange = () => {
      const token = getStorageItem('authToken') || getStorageItem('access_token');
      console.log('_app.js - Auth state changed, token:', token ? `${token.substring(0, 10)}...` : 'No token');
      
      // If token is gone but we have a user, logout
      if (!token && user) {
        console.log('_app.js - Token removed but user exists, logging out');
        setUser(null);
      }
      
      // If token exists but no user, fetch user data
      if (token && !user) {
        console.log('_app.js - Token exists but no user, fetching user data');
        fetchCurrentUser();
      }
    };
    
    // Only add event listeners on the client
    if (typeof window !== 'undefined') {
      // Listen for storage events
      window.addEventListener('storage', handleAuthChange);
      // Listen for custom auth events
      window.addEventListener('authChange', handleAuthChange);
    
      // Initial fetch
      fetchCurrentUser();

      // Clean up
      return () => {
        window.removeEventListener('storage', handleAuthChange);
        window.removeEventListener('authChange', handleAuthChange);
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [router, user]);
  
  // Function to check the authentication state and update it if needed
  const checkAuthState = async () => {
    // If we're on the login page with the logout parameter, don't check auth state
    if (router.pathname === '/login' && router.query.logout === 'true') {
      console.log('On login page after logout, skipping auth check');
      return;
    }
    
    const token = getStorageItem('authToken');
    
    if (token && !user) {
      console.log('Token found but user not set, fetching user data');
      
      try {
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.user) {
          console.log('User authenticated:', response.data.user);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        removeStorageItem('authToken');
      }
    } else if (!token && user) {
      console.log('Token not found but user is set, clearing user state');
      setUser(null);
    }
  };
  
  // Check authentication state on mount and when the route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkAuthState();
    }
  }, [router.pathname]);
  
  // Monitor changes to user state
  useEffect(() => {
    console.log('_app.js - User state changed:', user ? {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified
    } : 'No user');
    
    console.log('_app.js - isAuthenticated:', !!user);
  }, [user]);
  
  // Auth context methods
  const login = async (email, password) => {
    try {
      console.log('Logging in with email:', email);
      const response = await axios.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        setStorageItem('authToken', response.data.token);
        console.log('Setting user state after login:', response.data.user);
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      return false;
    }
  };
  
  const logout = () => {
    console.log('Logging out user');
    removeStorageItem('authToken');
    removeStorageItem('userEmail');
    removeStorageItem('tempPassword');
    setUser(null);
    console.log('User state cleared after logout');
    
    // Redirect to login page
    router.push('/login?logout=true');
  };
  
  const register = async (userData) => {
    try {
      console.log('Registering user:', { ...userData, password: '********' });
      
      const response = await axios.post('/auth/register', userData);
      
      console.log('Registration response:', response.data);
      
      if (response.data.success && response.data.token) {
        // Store token in localStorage
        setStorageItem('authToken', response.data.token);
        setStorageItem('userEmail', userData.email);
        
        // Store password temporarily for automatic login after verification
        if (userData.password) {
          setStorageItem('tempPassword', userData.password);
        }
        
        // Set the user state with the user data from the response
        if (response.data.user) {
          console.log('Setting user state after registration:', response.data.user);
          setUser(response.data.user);
          
          // Add a small delay to ensure the state is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Verify that the user state was set
          console.log('User state after registration:', user);
        } else {
          console.error('No user data in registration response');
        }
        
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const verifyEmail = async (email, otp) => {
    try {
      console.log('Verifying email with OTP:', otp);
      const response = await axios.post('/auth/verify-email', { email, otp });
      
      console.log('Verification response:', response.data);
      
      if (response.data.success) {
        console.log('Email verification successful');
        
        // Get the token from localStorage
        const token = getStorageItem('authToken');
        
        if (!token) {
          console.log('No token found after verification, attempting login');
          
          // Try to log in with stored credentials
          const password = getStorageItem('tempPassword');
          if (email && password) {
            try {
              console.log('Attempting login after verification');
              const loginResponse = await axios.post('/auth/login', { email, password });
              
              console.log('Login response after verification:', loginResponse.data);
              
              if (loginResponse.data.success && loginResponse.data.token) {
                setStorageItem('authToken', loginResponse.data.token);
                console.log('Setting user state after verification login:', loginResponse.data.user);
                setUser(loginResponse.data.user);
                
                // Add a small delay to ensure the state is updated
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Verify that the user state was set
                console.log('User state after verification login:', user);
                
                return true;
              }
            } catch (loginError) {
              console.error('Login error after verification:', loginError);
            }
          }
          return false;
        }
        
        // After successful verification, fetch the user data
        try {
          console.log('Fetching user data after verification');
          const userResponse = await axios.get('/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('User data after verification:', userResponse.data);
          
          if (userResponse.data && userResponse.data.user) {
            console.log('Setting user state after verification:', userResponse.data.user);
            setUser(userResponse.data.user);
            
            // Add a small delay to ensure the state is updated
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Verify that the user state was set
            console.log('User state after verification:', user);
            
            console.log('User state updated after verification');
            
            // Clean up temporary password
            removeStorageItem('tempPassword');
            
            return true;
          } else {
            console.log('No user data returned after verification');
            return false;
          }
        } catch (userError) {
          console.error('Error fetching user data after verification:', userError);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Verification error:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      return false;
    }
  };
  
  // Auth context value
  const authContextValue = {
    user,
    loading,
    isAuthenticated: !!user || !!(getStorageItem('authToken') || getStorageItem('access_token')),
    login,
    logout,
    register,
    verifyEmail,
    setUser
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      <Toaster position="top-center" />
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-auralblue"></div>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthContext.Provider>
  );
}

export default MyApp;
