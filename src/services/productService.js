/**
 * Product Service
 * Handles all API calls related to products
 */

// Base API URL - Fallback to localhost if env variable is not set
const API_BASE_URL = process.env.NEXT_PUBLIC_ECOMMERCE_SERVICE_URL || 'http://localhost:5005/api';

/**
 * Product Service object
 */
const productService = {
  /**
   * Get products with optional filters, sorting, and pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (starts at 1)
   * @param {number} options.limit - Items per page
   * @param {string} options.sort - Sort field (e.g., 'price', 'name')
   * @param {string} options.order - Sort order ('asc' or 'desc')
   * @param {string} options.category - Filter by category
   * @param {boolean} options.in_stock - Filter by stock availability
   * @param {Array} options.price_range - Filter by price range [min, max]
   * @param {boolean} options.is_featured - Filter featured products
   * @param {boolean} options.is_bestseller - Filter bestseller products
   * @param {boolean} options.is_new - Filter new products
   * @returns {Promise<Object>} Response with products data and pagination info
   */
  async getProducts(options = {}) {
    try {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.order) queryParams.append('order', options.order);
      if (options.category) queryParams.append('category', options.category);
      if (options.in_stock !== undefined) queryParams.append('in_stock', options.in_stock);
      if (options.price_range) {
        const [min, max] = options.price_range;
        if (min !== undefined) queryParams.append('min_price', min);
        if (max !== undefined) queryParams.append('max_price', max);
      }
      if (options.is_featured !== undefined) queryParams.append('is_featured', options.is_featured);
      if (options.is_bestseller !== undefined) queryParams.append('is_bestseller', options.is_bestseller);
      if (options.is_new !== undefined) queryParams.append('is_new', options.is_new);
      if (options.search) queryParams.append('search', options.search);
      
      // Fetch products
      const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to fetch products',
          data: null
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Products fetched successfully',
        data: data.data ? {
          products: data.data,
          pagination: data.pagination
        } : null
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null
      };
    }
  },

  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Response with product data
   */
  async getProductById(id) {
    try {
      if (!id) {
        return {
          success: false,
          message: 'Product ID is required',
          data: null
        };
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to fetch product',
          data: null
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Product fetched successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null
      };
    }
  },

  /**
   * Get related products for a specific product
   * @param {string} productId - Product ID
   * @param {number} limit - Number of related products to fetch
   * @returns {Promise<Object>} Response with related products data
   */
  async getRelatedProducts(productId, limit = 4) {
    try {
      if (!productId) {
        return {
          success: false,
          message: 'Product ID is required',
          data: null
        };
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}/related?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to fetch related products',
          data: null
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Related products fetched successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching related products:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null
      };
    }
  },

  /**
   * Get all product categories
   * @returns {Promise<Object>} Response with categories data
   */
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || 'Failed to fetch categories',
          data: null
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: 'Categories fetched successfully',
        data: data.data
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null
      };
    }
  }
};

export default productService; 