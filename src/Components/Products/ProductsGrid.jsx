'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter, FaHeadphones, FaRegHeart, FaShoppingCart, FaSpinner } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdBrandingWatermark, MdPriceChange } from 'react-icons/md';
import Slider from '@mui/material/Slider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import useProducts from '@/hooks/useProducts';

const ProductsGrid = ({ categories = [], initialCategory = null }) => {
  // Get products and functions from custom hook
  const { 
    products, 
    loading, 
    error, 
    pagination, 
    fetchProducts, 
    formatPrice 
  } = useProducts();

  // Filter and sort states
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Effect to fetch products on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      const options = {
        page: currentPage,
        limit: 9, // Show 9 products per page (3x3 grid)
      };
      
      // Add category filter if selected
      if (selectedCategories.length === 1) {
        options.category = selectedCategories[0];
      }
      
      // Add in-stock filter if selected
      if (inStockOnly) {
        options.in_stock = true;
      }
      
      // Add price range filter
      if (priceRange[0] > 0 || priceRange[1] < 100000) {
        options.price_range = priceRange;
      }
      
      // Add search query
      if (searchQuery) {
        options.search = searchQuery;
      }
      
      // Add sorting
      switch (sortBy) {
        case 'price-low':
          options.sort = 'price';
          options.order = 'asc';
          break;
        case 'price-high':
          options.sort = 'price';
          options.order = 'desc';
          break;
        case 'rating':
          options.sort = 'rating_average';
          options.order = 'desc';
          break;
        default:
          // 'featured' - sort by featured status
          options.sort = 'is_featured';
          options.order = 'desc';
          break;
      }
      
      await fetchProducts(options);
    };
    
    fetchData();
  }, [fetchProducts, currentPage, selectedCategories, selectedBrands, priceRange, sortBy, searchQuery, inStockOnly]);

  // Handle page change for pagination
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top of product grid
    window.scrollTo({
      top: document.getElementById('products-container').offsetTop - 100,
      behavior: 'smooth'
    });
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Generate search suggestions based on product names
  useEffect(() => {
    if (searchQuery.length > 2 && products.length > 0) {
      const suggestions = products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.brand_name && product.brand_name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(product => ({
          label: product.name,
          category: product.category_name || 'Hearing Aid',
          brand: product.brand_name || 'Aural'
        }));
      setSearchSuggestions(suggestions.slice(0, 5));
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  return (
    <div className="mx-auto px-4 py-8" id="products-container">
      {/* Enhanced Title Section */}
      <div className="mb-12 relative">
        <div className="flex flex-col items-center text-center">
          <span className="text-sm font-medium text-auralblue uppercase tracking-wider mb-2 font-poppins">
            Our Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-outfit font-bold text-auralyellow mb-4 relative">
            Hearing Aid Products
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-auralblue"></span>
          </h1>
          <p className="text-gray-600 font-poppins mt-4 max-w-2xl mx-auto text-center">
            Discover our comprehensive range of cutting-edge hearing solutions, 
            expertly curated to enhance your hearing experience and improve your quality of life.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-10 w-full max-w-3xl mx-auto">
            <div className="text-center">
              <span className="block text-3xl font-bold text-auralblue font-outfit">{pagination.total || 0}+</span>
              <span className="text-sm text-gray-600 font-poppins">Products</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-auralblue font-outfit">{categories.length || 0}+</span>
              <span className="text-sm text-gray-600 font-poppins">Categories</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-auralblue font-outfit">1000+</span>
              <span className="text-sm text-gray-600 font-poppins">Happy Customers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Modern Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="sticky top-4 space-y-6 bg-white px-6 rounded-xl shadow-sm relative">
            {/* Search Bar with Autocomplete */}
            <Autocomplete
              freeSolo
              options={searchSuggestions}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.label
              }
              filterOptions={(x) => x}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              renderOption={(props, option) => (
                <li {...props} className="p-3 hover:bg-gray-50 cursor-pointer">
                  <div className="flex flex-col">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="font-medium text-auralblue">{option.brand}</span>
                      <span>•</span>
                      <span>{option.category}</span>
                    </div>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search products..."
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <FaSearch className="text-gray-400 mr-2" />,
                    className: "font-poppins",
                    sx: {
                      '& fieldset': { borderColor: '#e5e7eb' },
                      '&:hover fieldset': { borderColor: '#04adf0' },
                      '&.Mui-focused fieldset': { borderColor: '#04adf0' },
                    }
                  }}
                />
              )}
              sx={{
                '& .MuiAutocomplete-listbox': {
                  maxHeight: '300px',
                  '& ::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '& ::-webkit-scrollbar-thumb': {
                    backgroundColor: '#04adf0',
                    borderRadius: '3px',
                  }
                }
              }}
            />

            {/* Filter Sections */}
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BiCategory className="text-xl text-auralblue" />
                  <h3 className="font-outfit font-semibold text-lg">Categories</h3>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id || category.name} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.slug || category.name)}
                        onChange={(e) => {
                          const categoryValue = category.slug || category.name;
                          if (e.target.checked) {
                            setSelectedCategories([categoryValue]); // Single category selection
                          } else {
                            setSelectedCategories([]);
                          }
                          setCurrentPage(1); // Reset to first page
                        }}
                        className="form-checkbox text-auralblue rounded focus:ring-auralblue h-4 w-4"
                      />
                      <span className="font-poppins text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MdPriceChange className="text-xl text-auralblue" />
                  <h3 className="font-outfit font-semibold text-lg">Price Range</h3>
                </div>
                <Slider
                  value={priceRange}
                  onChange={(event, newValue) => setPriceRange(newValue)}
                  onChangeCommitted={(event, newValue) => {
                    setPriceRange(newValue);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                  min={0}
                  max={100000}
                  step={1000}
                  sx={{
                    color: '#04adf0',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#fff',
                      border: '2px solid #04adf0',
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: '#04adf0',
                    }
                  }}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Stock Status Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FaHeadphones className="text-xl text-auralblue" />
                  <h3 className="font-outfit font-semibold text-lg">Availability</h3>
                </div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setCurrentPage(1); // Reset to first page
                    }}
                    className="form-checkbox text-auralblue rounded focus:ring-auralblue h-4 w-4"
                  />
                  <span className="font-poppins text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="py-2 mt-4 text-white bg-auralblue px-2 rounded-lg hover:bg-auralblue/90 transition-colors duration-300 font-poppins mb-2 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          {/* Sort Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600 font-poppins">
              {loading ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin text-auralblue" />
                  <span>Loading products...</span>
                </div>
              ) : (
                <span>Showing {products.length} of {pagination.total || 0} products</span>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // Reset to first page
              }}
              className="px-4 py-2 border rounded-md font-poppins"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Loading, Error or Empty States */}
          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <FaSpinner className="text-4xl text-auralblue animate-spin" />
                <p className="text-gray-600 font-poppins">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md">
                <p className="text-lg mb-3 font-outfit">Oops! Something went wrong.</p>
                <p className="text-sm mb-4">{error}</p>
                <button 
                  onClick={() => fetchProducts()}
                  className="px-4 py-2 bg-auralblue text-white rounded-md hover:bg-auralblue/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="bg-gray-50 border border-gray-200 px-6 py-8 rounded-lg text-center max-w-md">
                <p className="text-lg mb-3 font-outfit">No products found</p>
                <p className="text-sm text-gray-600 mb-4">Try adjusting your filters or search criteria.</p>
                <button 
                  onClick={resetFilters}
                  className="px-4 py-2 bg-auralblue text-white rounded-md hover:bg-auralblue/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            // Products Grid - 3 columns
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && products.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid; 