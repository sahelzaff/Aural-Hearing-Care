'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaCalendarAlt, FaVideo, FaHome, FaChevronRight } from 'react-icons/fa';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import assets from '../../../public/assets/assets';
import Link from 'next/link';
import FooterWoForm from '@/Components/Global Components/FooterWoForm';
import AppointmentForm from '@/Components/About-us/AppointmentForm';

const AboutUs = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />
      
       {/* Hero Section */}
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[55vh] bg-gray-900 flex items-end justify-start text-left"
        style={{
          backgroundImage: `url(${assets.about_banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 max-w-4xl px-4 pb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2 font-outfit"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 font-outfit"
          >
           Discover the Path to Clearer Hearing
          </motion.p>
        </div>
      </motion.div>

      {/* Breadcrumbs */}
      <nav className="bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm font-poppins">
            <a href="/" className="text-gray-600 hover:text-auralblue transition-colors">Home</a>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-auralblue font-medium">About Us</span>
          </div>
        </div>
      </nav>

      {/* Mission Section */}
      <section className="py-20 bg-white" ref={containerRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            style={{ opacity, y }}
          >
            <div className="space-y-6">
              <motion.h2 
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 font-outfit"
              >
                Dedicated to Your Hearing Health
              </motion.h2>
              <motion.p 
                variants={fadeInUpVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-lg text-gray-600 leading-relaxed font-poppins"
              >
                At our clinic, we're dedicated to providing personalized care throughout your entire hearing health journey. 
                We take pride in offering tailored services that are driven by your needs and preferences.
              </motion.p>
              {/* Add more paragraphs with motion */}
            </div>
            <motion.div 
              className="rounded-lg overflow-hidden shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={assets.about_info} 
                alt="About Us" 
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Doctor Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Welcome to Ear Studio</h2>
            <p className="text-xl text-gray-600 font-poppins">
              Your Independent, Personal and Local Audiology Competency Center
            </p>
          </motion.div>

          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              src={assets.about}
              className="w-full h-full object-cover"
              controls={isVideoPlaying}
              onClick={() => setIsVideoPlaying(true)}
            />
            {!isVideoPlaying && (
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer"
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setIsVideoPlaying(true)}
              >
                <motion.img
                  src={assets.play_button}
                  alt="Play"
                  className="w-20 h-20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTAs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <FaWhatsapp className="text-4xl" />, 
                text: "WhatsApp Us", 
                action: "Chat Now",
                bgImage: assets.whatsapp_now
              },
              { 
                icon: <FaPhoneAlt className="text-4xl" />, 
                text: "Request a Call Back", 
                action: "Call Me",
                bgImage: assets.call_now
              },
              { 
                icon: <FaVideo className="text-4xl" />, 
                text: "Video Consultation", 
                action: "Book Now",
                bgImage: assets.video_consultation
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative h-[300px] rounded-xl overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Background Image with Zoom Effect */}
                <div 
                  className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-60 transition-opacity duration-300 group-hover:opacity-70" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-white z-10">
                  <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-6 font-outfit">{item.text}</h3>
                  <button className="bg-auralblue text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-300 font-poppins transform group-hover:scale-105">
                    {item.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div id='appointment-booking' className='mb-16'>
        <AppointmentForm />
      </div>

      <FooterWoForm />
    </>
  );
};

export default AboutUs; 