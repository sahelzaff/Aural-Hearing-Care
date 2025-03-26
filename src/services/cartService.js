/**
 * Cart Service
 * Handles all API calls related to the shopping cart
 */

// Base API URL - Fallback to localhost if env variable is not set
const API_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_SERVICE_URL || 'http://localhost:5005/api';

// Define the getAuthHeaders function to centralize header creation
const getAuthHeaders = () => {
  // Base headers
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Check for authentication token (for logged-in users)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }
  
  // If not authenticated, check for session token (for guest carts)
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('cart_session_token') : null;
  if (sessionToken) {
    headers['x-session-token'] = sessionToken;
  }
  
  return headers;
};

/**
 * Cart Service object
 */
const cartService = {
  /**
   * Get the current cart
   * Creates a new cart for guest users if one doesn't exist
   * @returns {Promise<Object>} Response with cart data
   */
  async getCart() {
    try {
      // Use the helper function to get the current headers
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: headers,
      });

      const data = await response.json();
      
      // If this is a guest cart, store the session token
      if (data.success && data.data) {
        // Guest cart handling
        if (data.data.is_guest && data.data.session_token) {
          localStorage.setItem('cart_session_token', data.data.session_token);
        }
        
        // Normalize the data to ensure we always have items as an array
        if (!data.data.items) {
          data.data.items = [];
        }
        
        // Ensure numeric types for cart values
        data.data.subtotal = typeof data.data.subtotal === 'string' 
          ? parseFloat(data.data.subtotal) 
          : (data.data.subtotal || 0);
          
        data.data.total = typeof data.data.total === 'string' 
          ? parseFloat(data.data.total) 
          : (data.data.total || 0);
          
        data.data.item_count = data.data.item_count || 0;
      }

      return {
        success: data.success,
        message: data.message,
        data: data.data,
        session_token: data.data?.session_token
      };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while fetching the cart',
        data: null
      };
    }
  },

  /**
   * Add a product to the cart
   * @param {Object} product - Product to add (with product_id, quantity)
   * @returns {Promise<Object>} Response with updated cart
   */
  async addToCart(product) {
    try {
      // Validate that we have a product_id
      if (!product.product_id) {
        console.error('Missing product_id in addToCart payload:', product);
        return {
          success: false,
          message: 'Product ID is required',
          data: null
        };
      }

      // Make sure product_id is properly formatted (no 'local-' prefix)
      const cleanProductId = product.product_id.toString().replace('local-', '');
      
      // Create a clean payload with only the expected properties
      const payload = {
        product_id: cleanProductId,
        quantity: product.quantity || 1
      };
      
      // Only add optional fields if they exist
      if (product.variant_id) payload.variant_id = product.variant_id;
      if (product.custom_options) payload.custom_options = product.custom_options;
      
      // Use the helper function to get the current headers
      const headers = getAuthHeaders();
      
      console.log('Adding to cart with payload:', payload);
      console.log('Using headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while adding to cart',
        data: null
      };
    }
  },

  /**
   * Update cart item quantity
   * @param {string} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<Object>} Response with updated cart data
   */
  async updateCartItem(itemId, quantity) {
    if (!itemId) {
      console.error('Cart item ID is required');
      return {
        success: false,
        message: 'Cart item ID is required',
        data: null
      };
    }
    
    try {
      console.log(`Updating cart item ${itemId} to quantity ${quantity}`);
      
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Cart item updated successfully:', data);
      } else {
        console.error('Failed to update cart item:', data.message);
      }

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while updating cart item',
        data: null
      };
    }
  },

  /**
   * Remove item from cart
   * @param {string} itemId - Cart item ID
   * @returns {Promise<Object>} Response with updated cart data
   */
  async removeFromCart(itemId) {
    if (!itemId) {
      console.error('Cart item ID is required');
      return {
        success: false,
        message: 'Cart item ID is required',
        data: null
      };
    }
    
    try {
      console.log(`Removing item ${itemId} from cart`);
      
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Item removed from cart successfully:', data);
      } else {
        console.error('Failed to remove item from cart:', data.message);
      }

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while removing from cart',
        data: null
      };
    }
  },

  /**
   * Clear the cart (remove all items)
   * @returns {Promise<Object>} Response with empty cart data
   */
  async clearCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while clearing the cart',
        data: null
      };
    }
  },

  /**
   * Apply a coupon to the cart
   * @param {string} couponCode - Coupon code to apply
   * @returns {Promise<Object>} Response with updated cart data
   */
  async applyCoupon(couponCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while applying the coupon',
        data: null
      };
    }
  },

  /**
   * Remove coupon from the cart
   * @returns {Promise<Object>} Response with updated cart data
   */
  async removeCoupon() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/coupon`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error removing coupon:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while removing the coupon',
        data: null
      };
    }
  },

  /**
   * Merge guest cart with user cart after login
   * @param {string} sessionToken - Session token of the guest cart
   * @returns {Promise<Object>} Response with updated cart data
   */
  async mergeCart(sessionToken) {
    if (!sessionToken) {
      console.error('Session token is required for cart merging');
      return {
        success: false,
        message: 'Session token is required',
        data: null
      };
    }

    try {
      const headers = getAuthHeaders();
      
      // Ensure we have authorization token (user must be logged in to merge carts)
      if (!headers.Authorization) {
        console.error('Authentication token is required for cart merging');
        return {
          success: false,
          message: 'You must be logged in to merge carts',
          data: null
        };
      }
      
      console.log('Attempting to merge cart with session token:', sessionToken);
      
      const response = await fetch(`${API_BASE_URL}/cart/merge`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ session_token: sessionToken })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Cart merge successful:', data);
      } else {
        console.error('Cart merge failed:', data.message);
      }

      return {
        success: data.success,
        message: data.message,
        data: data.data
      };
    } catch (error) {
      console.error('Error merging cart:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while merging the cart',
        data: null
      };
    }
  },

  // Re-export the getAuthHeaders function
  getAuthHeaders,
};

export default cartService; 