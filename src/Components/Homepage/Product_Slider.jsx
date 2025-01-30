'use client';
import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from 'react-icons/fa';
import assets from '../../../public/assets/assets';


const ProductSlider = () => {
  const products = [
    {
      id: 1,
      image: assets.product_1,
      name: 'Phonak Product 1',
      price: '₹9999',
      review: 4,
    },
    {
      id: 2,
      image: assets.product_2,
      name: 'Phonak Product 2',
      price: '₹19999',
      review: 5,
    },
    {
      id: 3,
      image: assets.product_3,
      name: 'Phonak Product 3',
      price: '₹19200',
      review: 5,
    },
    {
      id: 4,
      image: assets.product_4,
      name: 'Phonak Product 4',
      price: '₹55999',
      review: 5,
    },
    {
      id: 5,
      image: assets.product_5,
      name: 'Phonak Product 5',
      price: '₹25999',
      review: 5,
    },
    // Add more products as needed
  ];

  const settings = {
    dots: false,
    infinite: true,
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

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-fit"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 font-poppins">{product.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl font-semibold text-gray-800 font-poppins">{product.price}</p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, index) => (
                      <FaStar
                        key={index}
                        className={`text-sm flex gap-1 ml-1  ${index < product.review ? 'text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className='flex flex-row items-center justify-center w-full'>
                <button className="mt-4  bg-auralyellow text-center text-white py-2 px-24 font-montserrat rounded-lg transition">
                  Buy Now
                </button>
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
