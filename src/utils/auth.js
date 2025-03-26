/**
 * Simple authentication utilities
 */
import { getSession } from 'next-auth/react';

/**
 * Get the auth token from localStorage
 * @returns {string|null} The authentication token or null if not found
 */
export const getAuthToken = () => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined') return null;
  
  // Standardize on access_token, but check both for backward compatibility
  const token = localStorage.getItem('access_token');
  if (token) return token;
  
  // Fallback to authToken if access_token is not found
  const legacyToken = localStorage.getItem('authToken');
  if (legacyToken) {
    // Migrate legacy token to the standardized format
    localStorage.setItem('access_token', legacyToken);
    return legacyToken;
  }
  
  return null;
};

/**
 * Check if the user is authenticated using localStorage tokens
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined') return false;
  
  return !!getAuthToken();
};

/**
 * Check if the user is authenticated using NextAuth session
 * This is an asynchronous function that should be preferred over isAuthenticated when possible
 * @returns {Promise<boolean>} Promise that resolves to true if authenticated, false otherwise
 */
export const isAuthenticatedWithSession = async () => {
  try {
    const session = await getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    // Fall back to token-based auth if session check fails
    return isAuthenticated();
  }
};

/**
 * Get user data from NextAuth session
 * @returns {Promise<Object|null>} Promise that resolves to user data or null if not authenticated
 */
export const getSessionUser = async () => {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Error getting session user:', error);
    return null;
  }
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The token to store
 */
export const setAuthToken = (token) => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined') return;
  
  if (!token) return;
  
  // Clear any existing tokens first to prevent inconsistencies
  clearAuthTokens();
  
  // Set the token using our standardized key
  localStorage.setItem('access_token', token);
};

/**
 * Clear all authentication tokens from localStorage
 */
export const clearAuthTokens = () => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined') return;
  
  // Remove all possible token variations to ensure complete logout
  localStorage.removeItem('access_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token');
};

/**
 * Trigger an event to notify components of authentication state changes
 */
export const triggerAuthStateChange = () => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined') return;
  
  // Dispatch both events for wider compatibility
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('authChange', { detail: { authenticated: isAuthenticated() } }));
};

/**
 * Get the device information for the current session
 * @returns {string} A string describing the current device and browser
 */
export const getDeviceInfo = () => {
  // Safety check for server-side rendering
  if (typeof window === 'undefined' || !navigator) return 'Unknown Device';
  
  // Get browser name
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown Browser';
  
  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = 'Chrome';
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = 'Firefox';
  } else if (userAgent.match(/safari/i)) {
    browserName = 'Safari';
  } else if (userAgent.match(/opr\//i)) {
    browserName = 'Opera';
  } else if (userAgent.match(/edg/i)) {
    browserName = 'Edge';
  } else if (userAgent.match(/android/i)) {
    browserName = 'Android Browser';
  } else if (userAgent.match(/iphone|ipad|ipod/i)) {
    browserName = 'iOS Safari';
  }
  
  // Get device type
  let deviceType = 'Desktop';
  
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    deviceType = 'Mobile';
    
    if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
      deviceType = 'Tablet';
    }
  }
  
  // Get OS
  let os = 'Unknown OS';
  
  if (/Windows NT 10.0/i.test(userAgent)) {
    os = 'Windows 10';
  } else if (/Windows NT 6.3/i.test(userAgent)) {
    os = 'Windows 8.1';
  } else if (/Windows NT 6.2/i.test(userAgent)) {
    os = 'Windows 8';
  } else if (/Windows NT 6.1/i.test(userAgent)) {
    os = 'Windows 7';
  } else if (/Mac OS X/i.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS';
  }
  
  return `${browserName} on ${os} (${deviceType})`;
}; 