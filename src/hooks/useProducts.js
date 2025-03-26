import { useState, useEffect, useCallback } from 'react';
import productService from '@/services/productService';

/**
 * Custom hook for product-related functionality
 * @returns {Object} Product-related functions and state
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  /**
   * Fetch products with optional filters
   * @param {Object} options - Query options
   */
  const fetchProducts = useCallback(async (options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { success, message, data } = await productService.getProducts(options);
      
      if (success && data) {
        setProducts(data.products);
        setPagination(data.pagination);
      } else {
        setError(message || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('An unexpected error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single product by ID
   * @param {string} id - Product ID
   */
  const fetchProductById = useCallback(async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { success, message, data } = await productService.getProductById(id);
      
      if (success && data) {
        setProduct(data);
      } else {
        setError(message || 'Failed to fetch product details');
        setProduct(null);
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('An unexpected error occurred');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch related products for a given product
   * @param {string} productId - Product ID
   * @param {number} limit - Number of related products to fetch
   * @returns {Promise<Array>} Array of related products
   */
  const fetchRelatedProducts = useCallback(async (productId, limit = 4) => {
    if (!productId) return [];
    
    try {
      const { success, data } = await productService.getRelatedProducts(productId, limit);
      
      if (success && data) {
        return data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching related products:', err);
      return [];
    }
  }, []);

  /**
   * Fetch all product categories
   * @returns {Promise<Array>} Array of categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      const { success, data } = await productService.getCategories();
      
      if (success && data) {
        return data;
      }
      return [];
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  }, []);

  // Format price to Indian Rupee format
  const formatPrice = (value) => {
    if (!value) return '₹0';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value).replace('INR', '₹');
  };

  // Get image URL, handling various data structures
  const getImageUrl = (product) => {
    if (!product) return '';
    
    // If there's an images array, use the first one that has primary flag
    if (product.images && product.images.length > 0) {
      // First try to find the primary image
      const primaryImage = product.images.find(img => img.is_primary);
      const imageToUse = primaryImage || product.images[0];
      
      if (imageToUse) {
        if (typeof imageToUse === 'string') {
          return imageToUse; // Return the URL as is
        } else if (imageToUse.url) {
          return imageToUse.url; // Return the URL as is
        }
      }
    }
    
    // If there's a primary_image field
    if (product.primary_image) {
      return product.primary_image; // Return the URL as is
    }
    
    // Return empty string if no image found
    return '';
  };

  return {
    // State
    products,
    product,
    loading,
    error,
    pagination,
    
    // Functions
    fetchProducts,
    fetchProductById,
    fetchRelatedProducts,
    fetchCategories,
    formatPrice,
    getImageUrl
  };
};

export default useProducts; 