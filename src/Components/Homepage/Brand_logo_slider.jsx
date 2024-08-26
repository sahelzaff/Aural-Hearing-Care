'use client';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import assets from '../../../public/assets/assets';

const BrandLogoSlider = () => {
  const logos = [
    assets.Brand_logo_1,
    assets.Brand_logo_2,
    assets.Brand_logo_3,
    assets.Brand_logo_4,
    assets.Brand_logo_5,
  ];

  const settings = {
    infinite: true, 
    speed: 5000, 
    slidesToShow: 5, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 0, 
    cssEase: 'linear', 
    draggable: true, 
    swipeToSlide: true,
    touchMove: true, 
    arrows: false, 
    dots: false, 
    pauseOnHover: false, 
  };

  return (
    <div className="max-w-full mx-auto py-8 bg-gray-50">
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="flex justify-center items-center h-full px-6 gap-10">
            <img
              src={logo}
              alt={`Brand ${index + 1}`}
              className="w-full h-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandLogoSlider;
