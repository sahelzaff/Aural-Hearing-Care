'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaCalendarAlt, FaVideo, FaHome } from 'react-icons/fa';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import assets from '../../../public/assets/assets';

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
        className="relative h-[60vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${assets.about_banner})` 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-white text-center font-outfit"
          >
            Your Journey to Better Hearing
          </motion.h1>
        </div>
      </motion.div>

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
              { icon: <FaWhatsapp className="text-4xl" />, text: "WhatsApp Us", action: "Chat Now" },
              { icon: <FaPhone className="text-4xl" />, text: "Request a Call Back", action: "Call Me" },
              { icon: <FaVideo className="text-4xl" />, text: "Video Consultation", action: "Book Now" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-xl text-center"
                whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-auralblue mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-4 font-outfit">{item.text}</h3>
                <button className="bg-auralblue text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors font-poppins">
                  {item.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Book your Appointment</h2>
            <p className="text-gray-600 font-poppins">
              Start your path to enhanced speech and hearing health by filling out the form below.
            </p>
          </motion.div>

          <motion.form
            className="bg-white rounded-xl shadow-lg p-8"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Form fields here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Add form fields with animations */}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-auralblue text-white rounded-md font-poppins flex items-center justify-center gap-2"
              >
                <FaCalendarAlt />
                Book Appointment
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-auralblue text-auralblue rounded-md font-poppins flex items-center justify-center gap-2"
              >
                <FaHome />
                In-Home Care
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutUs; 