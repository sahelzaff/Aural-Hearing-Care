import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cartService from '@/services/cartService';
import { addToCart as addToReduxCart, removeFromCart as removeFromReduxCart, clearCart as clearReduxCart, syncCartFromBackend } from '@/store/cartSlice';
import { isAuthenticated } from '@/utils/auth';
import { toast } from 'react-hot-toast';

// Add this line to define API_BASE_URL using the same value from cartService
const API_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_SERVICE_URL || 'http://localhost:5005/api';

// Helper function to get auth headers (mirrors the one in cartService)
const getAuthHeaders = () => {
  // Check for token in localStorage (for authenticated users)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  // Base headers that are always included
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add session token if it exists (for guest users)
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('cart_session_token') : null;
  if (sessionToken && !token) {
    headers['x-session-token'] = sessionToken;
  }
  
  return headers;
};

/**
 * Hook for cart management
 * Handles both authenticated and guest carts
 * Provides fallback to Redux store for offline support
 * @returns {Object} Cart state and functions
 */
const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get cart state from Redux for sync and offline use
  const reduxCart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  
  // Track authentication state for switching between guest/auth carts
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  
  // Add a ref to prevent excessive re-renders in debug logging
  const debugLogTimerRef = useRef(null);
  const isInitialMountRef = useRef(true);
  
  // Add time tracking for fetchCart to prevent excessive calls
  const lastFetchTimeRef = useRef(0);
  const FETCH_THROTTLE_MS = 2000; // Minimum time between fetchCart calls
  
  /**
   * Sync the Redux cart with data from API
   * @param {Object} apiCart - Cart data from API
   */
  const syncReduxCartFromApi = useCallback((apiCart) => {
    if (!apiCart) return;
    
    // Use the new syncCartFromBackend action to fully replace the cart
    dispatch(syncCartFromBackend(apiCart));
    
    console.log('[useCart] Synced Redux cart from API data');
  }, [dispatch]);

  /**
   * Fetch cart from backend
   * Handles both authenticated and guest users
   */
  const fetchCart = useCallback(async (force = false) => {
    // Check if we recently fetched the cart data
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < FETCH_THROTTLE_MS) {
      console.log('[useCart] Skipping fetchCart - too soon since last fetch');
      return;
    }
    
    lastFetchTimeRef.current = now;
    setLoading(true);
    setError(null);
    
    try {
      const { success, message, data, session_token } = await cartService.getCart();
      
      if (success && data) {
        // Skip detailed logging to prevent console spam
        
        // Ensure the items property exists and is an array
        if (!Array.isArray(data.items)) {
          data.items = [];
        }
        
        // Store session token for guest carts
        if (data.is_guest && session_token) {
          localStorage.setItem('cart_session_token', session_token);
          setSessionToken(session_token);
        }
        
        // Set the cart with validated data
        setCart(data);
        
        // Sync with Redux store
        syncReduxCartFromApi(data);
      } else {
        setError(message || 'Failed to fetch cart');
        setCart(null);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching the cart');
      
      // Fallback to Redux state if API fails
      if (reduxCart && reduxCart.items.length > 0) {
        setCart({
          items: reduxCart.items.map(item => ({
            id: item.cartItemId || `local-${item.id}`,
            product_id: item.id,
            product_name: item.name,
            unit_price: item.price,
            quantity: item.quantity,
            total_price: item.totalPrice,
            product_image: item.image
          })),
          subtotal: reduxCart.totalAmount,
          total: reduxCart.totalAmount,
          item_count: reduxCart.totalQuantity,
          is_guest: !isUserAuthenticated
        });
      }
    } finally {
      setLoading(false);
    }
  }, [reduxCart, syncReduxCartFromApi, isUserAuthenticated]);
  
  /**
   * Merges guest cart with user cart after login
   * This should be called when a user logs in and has a guest cart
   */
  const mergeGuestCart = useCallback(async () => {
    const guestSessionToken = localStorage.getItem('cart_session_token');
    
    if (!guestSessionToken) {
      console.log('No guest cart found to merge');
      return { success: false, message: 'No guest cart to merge' };
    }

    setLoading(true);
    
    try {
      console.log('Merging guest cart with session token:', guestSessionToken);
      
      // Check if user is authenticated before attempting merge
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.log('User is not authenticated, cannot merge carts');
        setLoading(false);
        return { success: false, message: 'Authentication required to merge carts' };
      }
      
      const result = await cartService.mergeCart(guestSessionToken);
      
      if (result.success) {
        console.log('Cart merged successfully:', result);
        
        // After successful merge, clear the session token and Redux cart
        localStorage.removeItem('cart_session_token');
        dispatch(clearReduxCart());
        
        // Refresh cart data to get the newly merged cart
        await fetchCart();
        
        setLoading(false);
        return { success: true, message: 'Carts merged successfully' };
      } else {
        console.error('Failed to merge carts:', result.message);
        setLoading(false);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error in mergeGuestCart:', error);
      setLoading(false);
      return { success: false, message: 'An unexpected error occurred during cart merge' };
    }
  }, [dispatch, fetchCart]);

  // Check auth state and session token on mount and when localStorage changes
  useEffect(() => {
    if (isInitialMountRef.current) {
      // Don't run the mergeGuestCart on initial mount
      // This prevents potential issues with the cart state not being ready
      isInitialMountRef.current = false;
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      
      // Get session token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cart_session_token');
        setSessionToken(token);
      }
    } else {
      const checkAuthState = () => {
        const authenticated = isAuthenticated();
        setIsUserAuthenticated(authenticated);
        
        // Get session token from localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('cart_session_token');
          setSessionToken(token);
          
          // If user just became authenticated and has a session token, try to merge carts
          if (authenticated && token && cart && !cart.user_id) {
            mergeGuestCart();
          }
        }
      };
      
      checkAuthState();
    }
    
    // Listen for auth changes
    const handleAuthChange = () => {
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      
      // Get session token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('cart_session_token');
        setSessionToken(token);
      }
    };
    
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [cart?.user_id, mergeGuestCart]);
  
  /**
   * Add item to cart
   * @param {Object} product - Product to add (with product_id)
   * @param {number} quantity - Quantity to add
   * @returns {Promise<Object>} Result object with success and message
   */
  const addItem = useCallback(async (product, quantity = 1) => {
    if (!product) {
      console.error('[useCart] Invalid product data');
      return { success: false, message: 'Invalid product data' };
    }
    
    // Check if we're getting a product_id directly or need to extract it
    // IMPORTANT: Make sure we're using the correct product ID format without 'local.' prefix
    let productId;
    
    if (product.product_id) {
      // If product_id is directly provided, use it
      productId = product.product_id;
    } else if (product.id) {
      // If id is provided, use it - but clean any 'local-' prefix that might be there
      productId = product.id.toString().replace('local-', '');
    } else {
      console.error('[useCart] No product ID found in:', product);
      return { success: false, message: 'No product ID found' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use the cartService to directly add the item to the backend
      const result = await cartService.addToCart({
        product_id: productId,
        quantity: quantity || 1,
        variant_id: product.variant_id,
        custom_options: product.custom_options
      });
      
      console.log('[useCart] API response from addToCart:', result);
      
      if (result.success && result.data) {
        // Update local cart state with the latest data from API immediately
        setCart(result.data);
        
        // IMPORTANT: First dispatch Redux action with the ACTUAL data from the API response
        // to ensure consistent state between API and Redux
        const itemsCount = result.data.item_count || 
                         (result.data.items ? result.data.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0);

        const totalAmount = result.data.subtotal || 
                          (result.data.items ? result.data.items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0) : 0);
        
        // Sync the entire cart from API response to ensure consistency
        dispatch(syncCartFromBackend(result.data));
        
        // Get the actual product data from the API response that was just added
        let productInfo = null;
        if (result.data && result.data.items && result.data.items.length > 0) {
          // Find the item that was just added (using the most recently added item if exact match not found)
          productInfo = result.data.items.find(item => item.product_id === productId) || 
                        result.data.items[result.data.items.length - 1];
        }
        
        // Prepare rich product data for the notification with accurate cart quantities/totals
        const notificationProduct = {
          id: productId,
          name: productInfo ? productInfo.product_name : (product.product_name || product.name || 'Product'),
          price: productInfo ? parseFloat(productInfo.unit_price) : (product.unit_price || product.price || 0),
          quantity: quantity || 1,
          image: productInfo ? productInfo.product_image : (product.product_image || product.image || ''),
          brand_name: productInfo ? productInfo.brand_name : (product.brand_name || product.brand || ''),
          product_slug: productInfo ? productInfo.product_slug : (product.product_slug || ''),
          // Include accurate cart totals from API response
          cart_total: totalAmount,
          cart_quantity: itemsCount
        };
        
        console.log('Triggering cart notification with product and updated cart data:', notificationProduct);
        
        // Trigger cart add event for notification with complete product data and accurate cart totals
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartAdd', { 
            detail: notificationProduct
          }));
        }
        
        // Force a cart refresh to ensure we have the latest data but with a small delay
        // to let the current updates complete first
        setTimeout(() => {
          fetchCart(true);
        }, 500);
        
        return { success: true, message: 'Product added to cart', data: result.data };
      } else {
        setError(result.message || 'Failed to add product to cart');
        return { success: false, message: result.message || 'Failed to add product to cart' };
      }
    } catch (error) {
      console.error('[useCart] Error adding product to cart:', error);
      setError('An unexpected error occurred');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  }, [dispatch, fetchCart]);
  
  // Use the same function for both regular add and initialize
  const initializeCartWithProduct = addItem;
  
  // Fetch cart when component mounts or auth state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart, isUserAuthenticated]);
  
  /**
   * Updates quantity of an item in the cart
   * @param {string} itemId - ID of the cart item
   * @param {number} quantity - New quantity
   */
  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    if (!itemId || quantity < 1) {
      console.error('Invalid itemId or quantity');
      return { success: false, message: 'Invalid item ID or quantity' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Updating quantity for item ${itemId} to ${quantity}`);
      
      const result = await cartService.updateCartItem(itemId, quantity);
      
      if (result.success) {
        // Update local state after successful API call
        // Sync with Redux to ensure consistent state
        if (result.data) {
          setCart(result.data);
          
          // Calculate current cart totals from API response 
          const itemsCount = result.data.item_count || 
                         (result.data.items ? result.data.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0);

          const totalAmount = result.data.subtotal || 
                           (result.data.items ? result.data.items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0) : 0);
        
          // Sync the entire cart from API response
          dispatch(syncCartFromBackend(result.data));
                    
          // Broadcast cart update event for navbar and other listeners
          if (typeof window !== 'undefined') {
            console.log('Broadcasting cart update after quantity change:', { 
              cart_quantity: itemsCount, 
              cart_total: totalAmount 
            });
            
            window.dispatchEvent(new CustomEvent('cartAdd', { 
              detail: { 
                cart_quantity: itemsCount,
                cart_total: totalAmount,
                action: 'update_quantity',
                item_id: itemId,
                quantity: quantity
              }
            }));
          }
        }
        
        // Refresh cart data after a short delay to ensure all components are in sync
        setTimeout(() => {
          fetchCart(true);
        }, 300);
        
        console.log('Item quantity updated successfully');
      } else {
        setError(result.message || 'Failed to update item quantity');
        console.error('Failed to update item quantity:', result.message);
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      setError('An unexpected error occurred while updating item');
      setLoading(false);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }, [dispatch, fetchCart]);
  
  /**
   * Removes an item from the cart
   * @param {string} itemId - ID of the cart item to remove
   */
  const removeItem = useCallback(async (itemId) => {
    if (!itemId) {
      console.error('Item ID is required to remove from cart');
      return { success: false, message: 'Item ID is required' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Removing item ${itemId} from cart`);
      
      const result = await cartService.removeFromCart(itemId);
      
      if (result.success) {
        // Update local state with API response
        if (result.data) {
          setCart(result.data);
          
          // Calculate current cart totals from API response
          const itemsCount = result.data.item_count || 
                        (result.data.items ? result.data.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0);

          const totalAmount = result.data.subtotal || 
                          (result.data.items ? result.data.items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0) : 0);
          
          // Sync the entire cart from API response
          dispatch(syncCartFromBackend(result.data));
          
          // Broadcast cart update event for navbar and other listeners
          if (typeof window !== 'undefined') {
            console.log('Broadcasting cart update after item removal:', { 
              cart_quantity: itemsCount, 
              cart_total: totalAmount 
            });
            
            window.dispatchEvent(new CustomEvent('cartAdd', { 
              detail: { 
                cart_quantity: itemsCount,
                cart_total: totalAmount,
                action: 'remove_item',
                item_id: itemId
              }
            }));
          }
        }
        
        // Refresh cart data after a short delay to ensure all components are in sync
        setTimeout(() => {
          fetchCart(true);
        }, 300);
        
        console.log('Item removed successfully');
      } else {
        setError(result.message || 'Failed to remove item from cart');
        console.error('Failed to remove item from cart:', result.message);
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('An unexpected error occurred while removing item');
      setLoading(false);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }, [dispatch, fetchCart]);
  
  /**
   * Clears all items from the cart
   */
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Clearing cart');
      
      const result = await cartService.clearCart();
      
      if (result.success) {
        // Update local state and Redux store
        setCart(null);
        dispatch(clearReduxCart());
        
        // Broadcast cart update event with empty cart
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartAdd', { 
            detail: { 
              cart_quantity: 0,
              cart_total: 0,
              action: 'clear_cart'
            }
          }));
        }
        
        // Refresh cart after a slight delay
        setTimeout(() => {
          fetchCart(true);
        }, 300);
        
        console.log('Cart cleared successfully');
      } else {
        setError(result.message || 'Failed to clear cart');
        console.error('Failed to clear cart:', result.message);
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('An unexpected error occurred while clearing cart');
      setLoading(false);
      return { success: false, message: 'An unexpected error occurred' };
    }
  }, [dispatch, fetchCart]);
  
  /**
   * Apply coupon to cart
   * @param {string} couponCode - Coupon code to apply
   */
  const applyCoupon = useCallback(async (couponCode) => {
    if (!couponCode) {
      console.error('Coupon code is required');
      return { success: false, message: 'Coupon code is required' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, message, data } = await cartService.applyCoupon(couponCode);
      
      if (success && data) {
        setCart(data);
        return { success: true, message };
      } else {
        setError(message || 'Failed to apply coupon');
        console.error('Failed to apply coupon:', message);
        return { success: false, message };
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      setError('An unexpected error occurred while applying the coupon');
      return { success: false, message: 'An unexpected error occurred while applying the coupon' };
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Remove coupon from cart
   */
  const removeCoupon = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { success, message, data } = await cartService.removeCoupon();
      
      if (success && data) {
        setCart(data);
        return { success: true, message };
      } else {
        setError(message || 'Failed to remove coupon');
        console.error('Failed to remove coupon:', message);
        return { success: false, message };
      }
    } catch (err) {
      console.error('Error removing coupon:', err);
      setError('An unexpected error occurred while removing the coupon');
      return { success: false, message: 'An unexpected error occurred while removing the coupon' };
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Parse price values to ensure they're numbers (API might return strings)
  const parsePrice = (price) => {
    if (typeof price === 'string') {
      return parseFloat(price);
    }
    return price || 0;
  };
  
  // Add in the Redux items if the API cart has no items but Redux does
  let mergedItems = [];
  let totalItems = 0;
  
  if (Array.isArray(cart?.items) && cart.items.length > 0) {
    // Use API items if available
    mergedItems = cart.items;
    // Calculate total items by summing quantities
    totalItems = mergedItems.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
  } else if (reduxCart?.items?.length > 0) {
    // Fall back to Redux items
    mergedItems = reduxCart.items.map(item => ({
      id: item.cartItemId || `local-${item.id}`,
      product_id: item.id,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.totalPrice,
      product_image: item.image
    }));
    totalItems = reduxCart.totalQuantity;
  }

  // Calculate proper subtotal and total from the actual items
  const calculatedSubtotal = mergedItems.reduce(
    (sum, item) => sum + parsePrice(item.total_price || (parsePrice(item.unit_price) * (parseInt(item.quantity) || 1))),
    0
  );

  // Merge the data from both sources
  const mergedCart = {
    ...cart,
    items: mergedItems,
    item_count: totalItems, // Use actual total quantity of items
    subtotal: parsePrice(cart?.subtotal) || calculatedSubtotal || reduxCart.totalAmount,
    // If total is 0 or NaN, use subtotal instead
    total: parsePrice(cart?.total) || parsePrice(cart?.subtotal) || calculatedSubtotal || reduxCart.totalAmount,
    discount_amount: parsePrice(cart?.discount_amount) || 0,
    tax_amount: parsePrice(cart?.tax_amount) || 0,
    is_guest: cart?.is_guest !== undefined ? cart.is_guest : !isUserAuthenticated
  };

  // Calculate isEmpty based on whether there are any items
  const isEmpty = mergedItems.length === 0 || totalItems === 0;
  
  return {
    // State
    cart: mergedCart,
    loading,
    error,
    isEmpty,
    isGuestCart: mergedCart.is_guest,
    
    // Functions
    fetchCart,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    mergeGuestCart,
    initializeCartWithProduct
  };
};

export default useCart; 