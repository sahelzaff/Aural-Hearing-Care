'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaHeadphones, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdBrandingWatermark, MdPriceChange } from 'react-icons/md';
import Slider from '@mui/material/Slider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import assets from '../../../public/assets/assets';

const ITEMS_PER_PAGE = 8;

const ProductsGrid = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    brand: 'all',
  });
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Price formatter
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value).replace('INR', '₹');
  };

  // Fetch products (mock data for now)
  useEffect(() => {
    // Replace with actual API call
    const mockProducts = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Hearing Aid ${i + 1}`,
      brand: ['Phonak', 'Oticon', 'Widex', 'Starkey'][Math.floor(Math.random() * 4)],
      category: ['BTE', 'ITE', 'ITC', 'CIC'][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 50000) + 10000,
      image: assets[`product_${(i % 5) + 1}`],
      rating: Math.floor(Math.random() * 2) + 4,
      reviews: Math.floor(Math.random() * 100),
    }));
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...products];

    // Apply search
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filters
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Apply brand filters
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.includes(product.brand)
      );
    }

    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'featured' - no sorting needed
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, priceRange, sortBy, searchQuery, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      const suggestions = products
        .filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(product => ({
          label: product.name,
          category: product.category,
          brand: product.brand
        }));
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  return (
    <div className=" mx-auto px-4 py-8">
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
              <span className="block text-3xl font-bold text-auralblue font-outfit">{products.length}+</span>
              <span className="text-sm text-gray-600 font-poppins">Products</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-auralblue font-outfit">10+</span>
              <span className="text-sm text-gray-600 font-poppins">Brands</span>
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
          <div className="sticky top-4 space-y-6 bg-white px-6 rounded-xl shadow-sm relative ">
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
                const suggestions = products
                  .filter(product => 
                    product.name.toLowerCase().includes(newInputValue.toLowerCase()) ||
                    product.brand.toLowerCase().includes(newInputValue.toLowerCase())
                  )
                  .slice(0, 5)
                  .map(product => ({
                    label: product.name,
                    category: product.category,
                    brand: product.brand
                  }));
                setSearchSuggestions(suggestions);
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
                  {['Behind-the-Ear (BTE)', 'In-the-Ear (ITE)', 'In-the-Canal (ITC)', 'Completely-in-Canal (CIC)'].map((category) => (
                    <label key={category} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                        className="form-checkbox text-auralblue rounded focus:ring-auralblue h-4 w-4"
                      />
                      <span className="font-poppins text-gray-700">{category}</span>
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

              {/* Brand Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MdBrandingWatermark className="text-xl text-auralblue" />
                  <h3 className="font-outfit font-semibold text-lg">Brands</h3>
                </div>
                <div className="space-y-2">
                  {['Phonak', 'Oticon', 'Widex', 'Starkey'].map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                        className="form-checkbox text-auralblue rounded focus:ring-auralblue h-4 w-4"
                      />
                      <span className="font-poppins text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setPriceRange([0, 100000]);
                  setSearchQuery('');
                }}
                className="py-2 mt-4 text-white bg-auralblue px-2 rounded-lg hover:bg-auralblue hover:text-white transition-colors duration-300 font-montserrat mb-2 flex items-center gap-2"
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
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border  font-poppins"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Products Grid - Changed to 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {filteredProducts.length > ITEMS_PER_PAGE && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid; 