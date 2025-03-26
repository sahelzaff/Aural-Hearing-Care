'use client';
import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaStar, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import useProducts from '@/hooks/useProducts';

const ProductSlider = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchProducts, formatPrice, getImageUrl } = useProducts();

  useEffect(() => {
    // Fetch featured products on component mount
    const loadFeaturedProducts = async () => {
      setLoading(true);
      try {
        const { success, data } = await fetchProducts({ 
          is_featured: true, 
          limit: 8,
          sort: 'created_at',
          order: 'desc'
        });
        
        if (success && data?.products) {
          setFeaturedProducts(data.products);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedProducts();
  }, [fetchProducts]);

  const settings = {
    dots: true,
    infinite: featuredProducts.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-auralblue" />
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 font-poppins">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <Slider {...settings}>
        {featuredProducts.map((product) => (
          <div key={product.id} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={getImageUrl(product)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/product_1.avif';
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-2 font-poppins line-clamp-2">{product.name}</h3>
                {product.brand_name && (
                  <p className="text-sm text-auralblue mb-2 font-poppins">{product.brand_name}</p>
                )}
                <div className="flex items-center justify-between mb-2 mt-auto">
                  <p className="text-xl font-semibold text-gray-800 font-poppins">
                    {formatPrice(product.discounted_price || product.price)}
                  </p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, index) => (
                      <FaStar
                        key={index}
                        className={`text-sm flex gap-1 ml-1 ${
                          index < Math.floor(product.rating_average || 0) 
                            ? 'text-yellow-500' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center w-full'>
                  <Link href={`/products/${product.id}`} className="w-full">
                    <button className="mt-4 w-full bg-auralyellow text-center text-white py-2 font-medium font-poppins rounded-lg transition hover:bg-amber-500">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
