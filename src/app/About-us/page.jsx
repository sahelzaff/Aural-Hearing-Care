'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserMd, FaAward, FaGraduationCap, FaHospital, FaHandHoldingMedical, FaHeadphones } from 'react-icons/fa';
import { MdHealthAndSafety, MdOutlineVerified } from 'react-icons/md';
import assets from '../../../public/assets/assets';
import Reviews from '../../Components/Reviews/Reviews';

// Define a fallback banner image in case the assets import is problematic

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>      
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

      {/* Our Mission Section */}
      <section className="py-16 bg-white">
        <div className=" mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">Our Mission</h2>
            <div className="w-20 h-1 bg-auralblue mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              At Aural Hearing Care, our mission is to improve the quality of life for individuals with hearing impairments through personalized care, 
              cutting-edge technology, and compassionate service. We believe that better hearing leads to better living, and we're committed to 
              helping our patients reconnect with the sounds that matter most to them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Meet Dr. Rahul Pandey Section */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#bebebe]/10 to-transparent">
        <div className=" mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-auralblue/20 rounded-full z-0"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-auralblue/10 rounded-full z-0"></div>
                <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                  <div className="w-full h-[700px] bg-gray-200 relative">
                    <Image 
                      src={assets.doctor_aboutus}
                      alt="Dr. Rahul Pandey" 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">Meet Dr. Rahul Pandey</h2>
              <div className="w-20 h-1 bg-auralblue mb-6"></div>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Dr. Rahul Pandey is a distinguished audiologist with over 15 years of experience in diagnosing and treating hearing disorders. 
                As the founder and lead audiologist at Aural Hearing Care, he has dedicated his career to helping patients of all ages 
                overcome hearing challenges and improve their quality of life.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                With a doctorate in Audiology from a prestigious medical institution and numerous certifications in advanced hearing technologies, 
                Dr. Pandey combines clinical expertise with a compassionate approach to patient care. His commitment to staying at the forefront 
                of audiological advancements ensures that his patients receive the most innovative and effective treatments available.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaGraduationCap className="text-auralblue text-xl" />
                  <span className="text-gray-700">Doctorate in Audiology</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaAward className="text-auralblue text-xl" />
                  <span className="text-gray-700">15+ Years Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <MdOutlineVerified className="text-auralblue text-xl" />
                  <span className="text-gray-700">Board Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaHandHoldingMedical className="text-auralblue text-xl" />
                  <span className="text-gray-700">Personalized Care</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 bg-white">
        <div className=" mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">Our Approach to Hearing Care</h2>
            <div className="w-20 h-1 bg-auralblue mx-auto mb-6"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-gradient-to-b from-auralblue/5 to-white rounded-xl p-6 border-2 border-auralblue/10 hover:border-auralblue/20 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-auralblue/20 rounded-full flex items-center justify-center mb-4">
                <FaUserMd className="text-auralblue text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personalized Assessment</h3>
              <p className="text-gray-700">
                We begin with a comprehensive evaluation of your hearing health, medical history, and lifestyle needs to create a tailored treatment plan.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group bg-gradient-to-b from-auralblue/5 to-white rounded-xl p-6 border-2 border-auralblue/10 hover:border-auralblue/20 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-auralblue/20 rounded-full flex items-center justify-center mb-4">
                <FaHeadphones className="text-auralblue text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced Technology</h3>
              <p className="text-gray-700">
                We offer state-of-the-art hearing aids and assistive devices, carefully selected to match your specific hearing needs and preferences.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group bg-gradient-to-b from-auralblue/5 to-white rounded-xl p-6 border-2 border-auralblue/10 hover:border-auralblue/20 shadow-md hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-auralblue/20 rounded-full flex items-center justify-center mb-4">
                <MdHealthAndSafety className="text-auralblue text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Ongoing Support</h3>
              <p className="text-gray-700">
                Our relationship doesn't end after treatment. We provide continuous care, adjustments, and support to ensure optimal hearing health.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Clinic Features Section */}
      <section className="py-16 bg-gradient-to-b from-transparent via-[#05ACF0]/10 to-transparent">
        <div className="mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 order-2 lg:order-1"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">Our State-of-the-Art Clinic</h2>
              <div className="w-20 h-1 bg-auralblue mb-6"></div>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Located in the heart of the city, Aural Hearing Care's modern facility is equipped with the latest diagnostic and treatment 
                technology. Our clinic provides a comfortable, welcoming environment where patients can receive comprehensive hearing care.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-auralblue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaHospital className="text-auralblue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Sound-Treated Testing Rooms</h3>
                    <p className="text-gray-600">Our specially designed rooms eliminate background noise for accurate hearing assessments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-auralblue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaAward className="text-auralblue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Advanced Diagnostic Equipment</h3>
                    <p className="text-gray-600">We use cutting-edge technology to provide precise evaluations and effective treatments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-auralblue/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FaHandHoldingMedical className="text-auralblue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Comfortable Consultation Areas</h3>
                    <p className="text-gray-600">Private spaces where we can discuss your hearing needs and treatment options.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/2 order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md bg-auralblue/10 h-[200px] relative backdrop-blur-sm">
                  <Image 
                    src={assets.interior_clinic}
                    alt="Aural Hearing Care Clinic Interior" 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md mt-6 bg-auralblue/10 h-[200px] relative backdrop-blur-sm">
                  <Image 
                    src={assets.hearing_equipments}
                    alt="Advanced Hearing Equipment" 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md bg-auralblue/10 h-[200px] relative backdrop-blur-sm">
                  <Image 
                    src={assets.consultant_patient}
                    alt="Patient Consultation" 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md mt-6 bg-auralblue/10 h-[200px] relative backdrop-blur-sm">
                  <Image 
                    src={assets.reception_area}
                    alt="Clinic Reception Area" 
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Replace Testimonials Section with Reviews Component */}
      <Reviews 
        title="What Our Patients Say"
        bgColor="bg-white"
        accentColor="bg-auralblue" 
        slidesToShow={3}
        autoplaySpeed={4000}
        gmb_review_url="https://g.page/r/CULh-LtkV86yEBM/review"
      />

      {/* CTA Section */}
      <section className="py-16 bg-auralblue/10">
        <div className=" mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">Begin Your Journey to Better Hearing</h2>
            <p className="text-lg text-gray-600 mb-8">
              Take the first step towards improved hearing health with Dr. Rahul Pandey and the team at Aural Hearing Care. 
              Schedule your comprehensive hearing assessment today.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-8 py-4 bg-auralblue text-white font-semibold rounded-lg shadow-md hover:bg-auralblue/90 transition-colors"
            >
              Book an Appointment
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutUs; 