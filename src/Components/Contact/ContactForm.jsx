'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-auralyellow/80 p-8 rounded-lg">
      <h2 className="text-3xl font-normal mb-6 font-poppins text-gray-700">Send us a message</h2>
      <p className="text-sm mb-6 font-poppins text-gray-700">
        <span className="text-red-500">*</span> indicates required fields
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm mb-2 font-poppins">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-200 font-poppins"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-poppins">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-200 font-poppins"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-poppins">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-200 font-poppins"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2 font-poppins">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-gray-200 font-poppins resize-none"
            required
          ></textarea>
        </div>
        <motion.button
          type="submit"
          className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors font-poppins"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          SUBMIT
        </motion.button>
      </form>
    </div>
  );
};

export default ContactForm; 