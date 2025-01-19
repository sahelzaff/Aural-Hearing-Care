'use client';
import React, { useEffect, useState } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/splide.min.css';
import '../Components.css';
import assets from '../../../public/assets/assets';

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const splide = new Splide('.splide', {
      type: 'fade',
      heightRatio: 0.5, // Optional, adjust if needed
      perPage: 1,
      autoplay: true,
      interval: 4000,
      pagination: false,
      arrows: false,
      rewind: true, 
      pauseOnHover: false, // Disable pausing on hover

    });

    splide.on('move', () => {
      setActiveSlide(splide.index);
    });

    splide.mount();
  }, []);

  const slides = [
    {
      img: assets.main_banner_1,
      title: 'Your Personal Hearing Care In Nagpur',
      description: 'At Aural Hearing Care, our commitment to excellence is reflected in the years of experience and superior clinical services we offer to our valued patients the best in hearing health.',
    },
    {
      img: assets.main_banner_2,
      title: 'Your Personal Audiologist',
      description: 'Audiologist Specializing in the evaluation and management of long standing hearing loss, we provide personalized, affordable solutions that suit your special requirements.',
    },
    {
      img: assets.main_banner_3,
      title: 'Your most RCI Certificated Audiologist In Nagpur',
      description: 'Your Journey toward better hearing begins here with a RCI Certificated Audiologist, dedicated to helping your ears hear better, ensuring a more comfortable and inspiring life.',
    },
    {
      img: assets.main_banner_4,
      title: 'Thank You for Making us one of the top-rated clinics in Nagpur',
      description: 'we combine years of experience with our clinical services to provide the highest level of care and expertise to our patients',
    },
  ];

  return (
    <div className="carousel-container">
      <div className="splide">
        <div className="splide__track">
          <ul className="splide__list">
            {slides.map((slide, index) => (
              <li key={index} className="splide__slide">
                <div className="carousel-image-container">
                  <img src={slide.img} className='carousel-image' alt={`Slide ${index + 1}`} />
                  <div className="carousel-overlay"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="carousel-overlay-content">
        <div className="carousel-text content pr-96">
          <div className='py-20'>
            <div>
              <h1 className='text-[45px] text-slate-50 font-semibold py-6 tracking-wider century '>
                {slides[activeSlide].title}
              </h1>
              <p className='century text-lg text-white pr-12'>
                {slides[activeSlide].description}
              </p>
              <div className='py-10'>
                <button 
                  type="button" 
                  className='bg-auralblue px-3 py-3 text-xl font-montserrat text-white rounded-lg font-semibold hover:scale-[1.03] transition-all duration-300 ease-in-out'>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
