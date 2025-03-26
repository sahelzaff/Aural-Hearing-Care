'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import assets from '../../../public/assets/assets';
import Reviews from '../../Components/Reviews/Reviews';
import { 
  FaBaby, 
  FaComments,
  FaAssistiveListeningSystems,
  FaMicrophone,
  FaRegSmile,
  FaHeartbeat,
  FaHeadphonesAlt,
  FaRegClock,
  FaUserMd,
  FaRegHospital,
  FaRecycle,
  FaChild,
  FaBalanceScale,
  FaWaveSquare,
  FaHandHoldingMedical,
  FaStethoscope,
  FaBrain,
  FaIndustry,
  FaAccessibleIcon,
  FaArrowRight,
  FaLaptopMedical,
  FaHeadphones
} from 'react-icons/fa';

const ServicesPage = () => {
  // Define brand colors
  const colors = {
    auralblue: '#0099cc',
    auralyellow: '#afcc1c'
  };

  // State for animations and interactions
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedService, setExpandedService] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Service categories
  const categories = [
    { id: "all", name: "All Services" },
    { id: "diagnostic", name: "Diagnostic Services" },
    { id: "treatment", name: "Treatment & Rehabilitation" },
    { id: "specialty", name: "Specialty Programs" },
    { id: "pediatric", name: "Pediatric Care" }
  ];

  // Comprehensive services list with categories
  const services = [
    {
      id: 1,
      title: "Early Intervention & Guidance",
      icon: <FaHandHoldingMedical className="text-3xl text-auralyellow" />,
      description: "Timely intervention when hearing issues are first detected, paired with expert guidance on next steps and available options.",
      longDescription: "Our early intervention program identifies hearing challenges at their onset, when treatment is most effective. We provide comprehensive guidance that empowers individuals and families to make informed decisions about their hearing health journey. Early detection and intervention can significantly improve outcomes and quality of life.",
      category: "treatment",
      image: assets.early_intervention
    },
    {
      id: 2,
      title: "Counseling",
      icon: <FaComments className="text-3xl text-auralblue" />,
      description: "Compassionate counseling services to support emotional well-being during hearing health adjustments.",
      longDescription: "Hearing loss can have profound emotional and psychological impacts. Our specialized counseling services help individuals and families navigate the emotional journey that often accompanies hearing changes. We provide a supportive environment to discuss concerns, set realistic expectations, and develop coping strategies.",
      category: "treatment",
      image: assets.counselling
    },
    {
      id: 3,
      title: "Ear Mold Available",
      icon: <FaHeadphones className="text-3xl text-auralyellow" />,
      description: "Custom-fitted ear molds for optimal comfort and effectiveness of hearing devices.",
      longDescription: "We create precisely crafted ear molds tailored to your unique ear anatomy. These custom-fitted pieces ensure maximum comfort and optimal performance for hearing aids and other devices. Our digital scanning technology captures exact measurements for a perfect fit that enhances sound quality and everyday comfort.",
      category: "treatment",
      image: assets.ear_mold
    },
    {
      id: 4,
      title: "Cochlear Implant Programme",
      icon: <FaMicrophone className="text-3xl text-auralblue" />,
      description: "Comprehensive evaluation, implantation coordination, and rehabilitation services for cochlear implant candidates.",
      longDescription: "Our cochlear implant program includes detailed candidacy assessments, surgical coordination with top specialists, and extensive pre and post-implantation support. We provide programming (mapping) services and specialized rehabilitation to help patients maximize the benefits of their cochlear implants, opening new pathways to sound for those with severe to profound hearing loss.",
      category: "treatment",
      image: assets.cochlear_implant
    },
    {
      id: 5,
      title: "Pure Tone Audiometry",
      icon: <FaWaveSquare className="text-3xl text-auralyellow" />,
      description: "Gold-standard hearing test to measure the softest sounds you can hear at different frequencies.",
      longDescription: "Pure tone audiometry is a fundamental diagnostic tool that measures hearing sensitivity across different frequencies. Our soundproof testing environment and advanced equipment ensure accurate results, creating a detailed audiogram that maps your hearing profile. This precise measurement helps determine the type and degree of hearing loss, forming the foundation for all treatment decisions.",
      category: "diagnostic",
      image: assets.tone_audiometry
    },
    {
      id: 6,
      title: "Hearing Aid Trial & Fitting",
      icon: <FaAssistiveListeningSystems className="text-3xl text-auralblue" />,
      description: "Experience hearing aids in real-world environments before purchase, with expert fitting services.",
      longDescription: "We believe in making informed decisions about hearing technology. Our trial program allows you to test various hearing aid models in your everyday environments before making a selection. Once chosen, our precise fitting process includes physical customization, digital programming, and real-ear measurements to verify performance. We provide comprehensive training on usage, care, and maintenance.",
      category: "treatment",
      image: assets.aid_fitting
    },
    {
      id: 7,
      title: "Hearing Aid Accessories",
      icon: <FaHeadphonesAlt className="text-3xl text-auralyellow" />,
      description: "Enhance your hearing aid experience with specialized accessories for connectivity and convenience.",
      longDescription: "Modern hearing aids can connect to various devices and accessories that further enhance your listening experience. We offer a wide range of accessories including TV streamers, remote microphones, smartphone connectors, and more. These additions can significantly improve hearing in challenging environments such as noisy restaurants, meetings, or while watching television.",
      category: "treatment",
      image: assets.hearing_accessories
    },
    {
      id: 8,
      title: "Speech Therapy",
      icon: <FaRegSmile className="text-3xl text-auralblue" />,
      description: "Specialized speech therapy services for children and adults with hearing-related communication challenges.",
      longDescription: "Our speech therapy services address the communication difficulties that often accompany hearing loss. Our specialized therapists work with both children and adults to improve speech clarity, language development, and communication strategies. For children with hearing loss, early intervention speech therapy is crucial for developing age-appropriate language skills. For adults, we focus on adapting to changes in hearing and maximizing communication effectiveness.",
      category: "treatment",
      image: assets.speech_therapy
    },
    {
      id: 9,
      title: "Tinnitus Management",
      icon: <FaBrain className="text-3xl text-auralyellow" />,
      description: "Comprehensive evaluation and therapy for tinnitus (ringing in the ears).",
      longDescription: "Tinnitus—the perception of sound when no external sound is present—can significantly impact quality of life. Our tinnitus management program begins with a thorough assessment to identify possible causes and triggers. We offer a variety of evidence-based treatments including sound therapy, cognitive behavioral techniques, tinnitus retraining therapy, and appropriate hearing technology when indicated. Our multifaceted approach aims to reduce the perceived intensity and distress associated with tinnitus.",
      category: "specialty",
      image: assets.tinnitus_management
    },
    {
      id: 10,
      title: "Newborn Hearing Screening",
      icon: <FaBaby className="text-3xl text-auralblue" />,
      description: "Early detection of hearing issues in newborns using gentle, non-invasive techniques.",
      longDescription: "Identifying hearing loss during the earliest stages of life is critical for language development. Our newborn hearing screening program uses state-of-the-art technology to perform quick, painless tests that can detect potential hearing issues. For babies who don't pass the initial screening, we provide comprehensive follow-up testing and early intervention services to ensure the best possible outcomes for development.",
      category: "pediatric",
      image: assets.newborn_screening
    },
    {
      id: 11,
      title: "Occupational Hearing Conservation Programs",
      icon: <FaIndustry className="text-3xl text-auralyellow" />,
      description: "Workplace hearing protection and monitoring for industries with noise exposure risks.",
      longDescription: "We partner with businesses to develop comprehensive hearing conservation programs that protect employees' hearing health. Our services include workplace noise assessments, custom hearing protection, employee education, and regular hearing monitoring. We help employers comply with safety regulations while protecting their most valuable asset—their workforce. Our programs are customized for various industries including manufacturing, construction, entertainment, and more.",
      category: "specialty",
      image: assets.occupational_hearing
    },
    {
      id: 12,
      title: "Vestibular Rehabilitation Therapy (VRT)",
      icon: <FaAccessibleIcon className="text-3xl text-auralblue" />,
      description: "Specialized therapy for balance disorders and dizziness related to inner ear issues.",
      longDescription: "The inner ear houses both hearing and balance systems, which is why we offer specialized vestibular rehabilitation therapy. For patients experiencing dizziness, vertigo, or balance problems related to inner ear dysfunction, our therapists provide customized exercise programs to reduce symptoms and improve stability. VRT can help the brain compensate for inner ear deficits and significantly improve quality of life for those suffering from vestibular disorders.",
      category: "specialty",
      image: assets.vrt_therapy
    },
    {
      id: 13,
      title: "Hearing Aid Recycling Program",
      icon: <FaRecycle className="text-3xl text-auralyellow" />,
      description: "Donate used hearing aids to help provide hearing solutions to those in need.",
      longDescription: "Our hearing aid recycling program gives new life to used hearing devices while helping those with financial constraints access better hearing. Donated aids are professionally cleaned, refurbished, and either provided to qualified recipients or used for parts to repair other devices. This program not only supports our community but also reduces electronic waste, making it a win for both people and the planet.",
      category: "specialty",
      image: assets.aid_recycling
    },
    {
      id: 14,
      title: "Pediatric Audiology Services",
      icon: <FaChild className="text-3xl text-auralblue" />,
      description: "Specialized hearing care for infants, children, and adolescents.",
      longDescription: "Children require specialized hearing assessment and treatment approaches. Our pediatric audiology services include age-appropriate hearing evaluations, custom-fitted pediatric hearing technology, and family-centered intervention strategies. We create a welcoming, child-friendly environment and use techniques that keep young patients engaged and comfortable. Our pediatric specialists are experienced in detecting and addressing hearing issues that can affect speech, language, social, and academic development.",
      category: "pediatric",
      image: assets.pediatric
    }
  ];

  // Filter services based on selected category
  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(service => service.category === activeCategory);

  // Simplified animation variants
  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  // Handle service expansion
  const handleServiceClick = (id) => {
    setExpandedService(expandedService === id ? null : id);
  };

  // Component for service cards with expandable details
  const ServiceCard = ({ service, index }) => {
    const isExpanded = expandedService === service.id;
    
    return (
      <motion.div
        initial={{ opacity: 1 }}
        className={`${isExpanded ? 'col-span-full' : 'md:col-span-1'} bg-white rounded-xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-100`}
        onClick={() => handleServiceClick(service.id)}
        style={{ 
          willChange: "auto",
          transform: "translateZ(0)"
        }}
      >
        <div className="p-6 cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${index % 2 === 0 ? 'bg-auralblue/10' : 'bg-auralyellow/10'} rounded-full flex items-center justify-center`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className={index % 2 === 0 ? "text-auralblue" : "text-auralyellow"}
            >
              <FaArrowRight />
            </motion.div>
          </div>
          <p className="mt-4 text-gray-600">{service.description}</p>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="px-6 pb-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-64 relative">
                    <Image
                      src={service.image || "https://placehold.co/600x400/e6f7ff/0099cc?text=Service+Image"}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 mb-4">{service.longDescription}</p>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center gap-2 text-auralyellow hover:underline"
                  >
                    <span>Schedule a consultation</span>
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Animation for the category tabs
  const tabVariants = {
    inactive: { 
      color: "#4B5563", 
      backgroundColor: "transparent",
      scale: 1
    },
    active: { 
      color: "white", 
      backgroundColor: "#afcc1c",
      scale: 1.05
    }
  };

  // Optimized parallax effect with CSS instead of JS scroll listener
  const heroStyle = {
    backgroundImage: `url(${assets.services_banner || "/assets/services/services-banner.jpg"})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  return (
    <>
      {/* Hero Section with CSS Parallax Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] bg-gray-900 flex items-end justify-start text-left overflow-hidden"
      >
        <div 
          style={{
            backgroundImage: `url(${assets.service_hero2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl px-4 pb-16">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-outfit">
            Hearing Care
            </h1>
            <p className="text-xl text-gray-200 font-outfit max-w-2xl">
              Advanced audiology services tailored to your unique hearing needs, delivered with compassion and expertise.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Breadcrumbs */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white  top-0 z-20 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm font-poppins">
              <Link href="/" className="text-gray-600 hover:text-auralblue transition-colors">Home</Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-auralblue font-medium">Services</span>
            </div>

            <Link 
              href="/contact"
              className="hidden md:inline-flex items-center gap-2 bg-auralyellow text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-auralyellow/90 transition-colors"
            >
              <span>Book Consultation</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Interactive Service Category Selection */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variants={tabVariants}
                initial="inactive"
                animate={activeCategory === category.id ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="px-5 py-2.5 rounded-full text-sm font-medium"
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Listings - Grid with Expandable Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-outfit">
              Our Comprehensive Services
            </h2>
            <div className="w-20 h-1 bg-auralyellow mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From diagnosis to treatment and ongoing support, we provide exceptional care at every step of your hearing health journey.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Treatment Process - Visual Journey */}
      <section className="py-16 bg-gradient-to-b from-auralblue/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-outfit">
              Your Hearing Care Journey
            </h2>
            <div className="w-20 h-1 bg-auralyellow mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our patient-centered approach ensures personalized care at every step
            </p>
          </motion.div>

          {/* Journey Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-auralblue/20 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-24 relative">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5 }}
                className="md:grid md:grid-cols-2 items-center gap-8"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg z-10 md:text-right">
                  <div className="flex md:justify-end">
                    <div className="w-14 h-14 bg-auralblue/10 rounded-full flex items-center justify-center mb-4">
                      <FaStethoscope className="text-3xl text-auralblue" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">1. Comprehensive Evaluation</h3>
                  <p className="text-gray-600">
                    Our journey begins with a thorough assessment of your hearing health using the latest diagnostic technology. We take the time to understand your unique needs and concerns.
                  </p>
                </div>
                <div className="hidden md:block"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5 }}
                className="md:grid md:grid-cols-2 items-center gap-8"
              >
                <div className="hidden md:block"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg z-10">
                  <div className="w-14 h-14 bg-auralblue/10 rounded-full flex items-center justify-center mb-4">
                    <FaUserMd className="text-3xl text-auralblue" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">2. Personalized Treatment Plan</h3>
                  <p className="text-gray-600">
                    Based on your evaluation results, we develop a customized treatment plan tailored to your specific hearing needs, lifestyle, and preferences.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5 }}
                className="md:grid md:grid-cols-2 items-center gap-8"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg z-10 md:text-right">
                  <div className="flex md:justify-end">
                    <div className="w-14 h-14 bg-auralblue/10 rounded-full flex items-center justify-center mb-4">
                      <FaLaptopMedical className="text-3xl text-auralblue" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">3. Advanced Technology Solutions</h3>
                  <p className="text-gray-600">
                    We provide access to state-of-the-art hearing technology and assistive devices, carefully selected to match your needs and properly fitted for optimal performance.
                  </p>
                </div>
                <div className="hidden md:block"></div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5 }}
                className="md:grid md:grid-cols-2 items-center gap-8"
              >
                <div className="hidden md:block"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg z-10">
                  <div className="w-14 h-14 bg-auralblue/10 rounded-full flex items-center justify-center mb-4">
                    <FaRegClock className="text-3xl text-auralblue" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">4. Ongoing Support & Care</h3>
                  <p className="text-gray-600">
                    Our commitment to your hearing health extends beyond the initial treatment. We provide continuous support, regular follow-ups, and maintenance services to ensure long-term success.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Replace the Testimonials Section with the Reviews Component */}
      <Reviews 
        title="What Our Patients Say"
        bgColor="bg-white"
        accentColor="bg-auralyellow" 
        slidesToShow={3}
        autoplaySpeed={4000}
        gmb_review_url="https://g.page/r/CULh-LtkV86yEBM/review"
      />

      {/* Enhanced CTA Section with Simplified Animation */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-auralblue/30 to-auralblue/5 z-0"></div>
        
        {/* Simplified Floating Shapes Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                opacity: 0.3,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50], 
                y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0.3, 0.5, 0.3],
                scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.6 + 0.4, Math.random() * 0.5 + 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 20 + i * 10, 
                repeatType: "reverse" 
              }}
              className="absolute rounded-full bg-white/20"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                width: `${50 + i * 30}px`,
                height: `${50 + i * 30}px`,
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 font-outfit">
                Begin Your Journey to Better Hearing Today
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our team of certified audiologists is ready to provide personalized care and innovative solutions for your unique hearing needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Link
                    href="/contact"
                    className="inline-block w-full sm:w-auto px-8 py-4 bg-auralyellow text-white font-semibold rounded-lg shadow-md hover:bg-auralyellow/90 transition-colors"
                  >
                    Schedule Consultation
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Link
                    href="/online-hearing-test"
                    className="inline-block w-full sm:w-auto px-8 py-4 bg-white text-auralyellow font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-auralyellow"
                  >
                    Take Online Hearing Test
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage; 