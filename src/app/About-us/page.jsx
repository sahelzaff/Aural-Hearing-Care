'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaStethoscope, FaUserMd, FaHandHoldingHeart, FaHeadphones } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlinePersonalVideo, MdHearing } from "react-icons/md";
import { IoEarOutline } from "react-icons/io5";
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import Navbar from '@/Components/Global Components/Navbar';
import Footer from '@/Components/Global Components/Footer';
import AppointmentForm from '@/Components/About-us/AppointmentForm';
import Testimonial from '@/Components/Homepage/Testimonial';
import assets from '../../../public/assets/assets';

const AboutPage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const features = [
    {
      icon: <FaStethoscope className="text-4xl text-auralblue" />,
      title: "Professional Care",
      description: "Dedicated to providing personalized care throughout your hearing health journey."
    },
    {
      icon: <MdHealthAndSafety className="text-4xl text-auralblue" />,
      title: "Expert Evaluation",
      description: "Highly trained in evaluating hearing in both adults and children using specialized equipment."
    },
    {
      icon: <MdHearing className="text-4xl text-auralblue" />,
      title: "Latest Technology",
      description: "Access to the latest digital hearing technology from top manufacturers."
    },
    {
      icon: <FaHandHoldingHeart className="text-4xl text-auralblue" />,
      title: "Personalized Solutions",
      description: "Customized hearing solutions focused on your unique requirements."
    }
  ];

  return (
    <>
      <TopbarBelow />
      <Navbar />
      
      {/* Hero Section */}
      <motion.div 
        ref={ref}
        className="relative h-[600px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${assets.about_banner})`,
            filter: 'brightness(0.85)'
          }}
        />
        <div className="relative z-10  mx-auto px-20 h-full flex flex-col justify-end pb-20">
          <motion.div
            className="max-w-2xl"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl font-outfit font-bold mb-6 text-white">
              Your Journey to Better Hearing
            </h1>
            <p className="text-xl font-poppins text-white/90 max-w-xl">
              Dedicated to providing exceptional hearing care with personalized solutions and cutting-edge technology
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className=" mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-outfit font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 font-poppins">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Introduction */}
      <section className="py-20">
        <div className=" mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  src={assets.about}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-outfit font-bold mb-6 text-auralblue">Welcome to Ear Studio</h2>
              <p className="text-lg font-poppins text-gray-700 mb-6">
                Your Independent, Personal and Local Audiology Competency Center. I understand that every patient has unique needs, so my focus is on providing a positive and health-driven outcome, carefully designed with your priorities in mind.
              </p>
              <div className="flex gap-4">
                <button className="bg-auralblue text-white px-6 py-3 rounded-lg font-poppins hover:bg-opacity-90 transition-colors flex items-center gap-2">
                  <IoEarOutline className="text-xl" />
                  Contact Us on WhatsApp
                </button>
                <button className="bg-auralyellow text-white px-6 py-3 rounded-lg font-poppins hover:bg-opacity-90 transition-colors flex items-center gap-2">
                  <FaUserMd className="text-xl" />
                  Request a Call Back
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonial />

      {/* Appointment Section */}
      <section className="py-20 bg-gray-50">
        <div className=" mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-outfit font-bold mb-4">Book your Appointment</h2>
            <p className="text-lg font-poppins text-gray-600">
              Start your path to enhanced speech and hearing health by filling out the form below.
            </p>
          </motion.div>
          
          <AppointmentForm />

          {/* Additional CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-2xl font-outfit font-bold mb-4">Online Video Consultation</h3>
              <button className="bg-auralblue text-white px-6 py-3 rounded-lg font-poppins hover:bg-opacity-90 transition-colors">
                Schedule Now
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-2xl font-outfit font-bold mb-4">In-Home Audiology Care</h3>
              <button className="bg-auralyellow text-white px-6 py-3 rounded-lg font-poppins hover:bg-opacity-90 transition-colors">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutPage; 