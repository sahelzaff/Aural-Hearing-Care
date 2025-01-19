'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { IoLocationSharp } from "react-icons/io5";

import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import FooterWoForm from '@/Components/Global Components/FooterWoForm';
import ContactForm from '@/Components/Contact/ContactForm';
import assets from 'public/assets/assets';

export default function ContactPage() {
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
          backgroundImage: `url(${assets.contact_hero})`,
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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 font-outfit"
          >
            Get in touch with us for any questions or concerns
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
            <span className="text-auralblue font-medium">Contact</span>
          </div>
        </div>
      </nav>

      {/* Contact Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6 pt-8">
              <h2 className="text-3xl font-normal font-poppins text-gray-700">Visit Aural Hearing Care Today !!</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <IoLocationSharp className="text-5xl text-auralblue " />
                  <p className="text-[16px] font-poppins text-gray-700">
                    Shop no: 6, Pushpkunj Complex, beside YES BANK, near Hotel Centre Point, Ramdaspeth, Nagpur, Maharashtra 440010
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="h-[400px] rounded-lg overflow-hidden mt-8">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14885.789053306651!2d79.0758841!3d21.1345917!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c090266c94d7%3A0xb2ce5764bbf8e142!2sAural%20Hearing%20Care!5e0!3m2!1sen!2sin!4v1724783436675!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '4px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>

          {/* Contact Info Cards Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-normal font-poppins text-gray-700 text-center mb-12">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-auralblue/15 to-auralyellow/15"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-auralblue/15 to-auralyellow/15 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-auralblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">Phone</h3>
                  <a href="tel:+919823449422" className="text-lg text-auralblue hover:text-auralblue/80 transition-colors font-poppins">
                    +91 98234 49422
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-auralblue/15 to-auralyellow/15"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-auralblue/15 to-auralyellow/15 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-auralblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">Working Hours</h3>
                  <p className="text-lg text-gray-600 font-poppins">Mon - Sat: 10:00 AM - 8:00 PM</p>
                  <p className="text-lg text-gray-600 font-poppins">Sunday: Closed</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-auralblue/15 to-auralyellow/15"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-auralblue/15 to-auralyellow/15 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-auralblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-3">Email</h3>
                  <a href="mailto:info@auralhearingcare.com" className="text-lg text-auralblue hover:text-auralblue/80 transition-colors font-poppins">
                    info@auralhearingcare.com
                  </a>
                </div>
              </motion.div>
            </div>

         
            </div>
          </div>
        </div>
            <div className="bg-auralblue/60 px-36 py-12 mb-8  shadow-lg w-full">
              <div className="mx-auto text-center flex justify-between items-center space-x-3">
                <h2 className="text-[26px] font-normal font-poppins mb-2 text-gray-700">
                  Speak to our experienced audiology team today
                </h2>
                <motion.a 
                  href="tel:+919823449422" 
                  className="inline-block bg-white text-auralblue font-semibold py-3 px-6 rounded-lg shadow-md transition-transform duration-150 hover:shadow-lg text-[18px]" // Reduced duration for faster animation
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  Speak Now
                </motion.a>
              </div>
            </div>
      

      <FooterWoForm />
    </>
  );
} 