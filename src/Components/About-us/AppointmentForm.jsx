'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaComment } from 'react-icons/fa';

const AppointmentForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-gray-700 font-poppins mb-2">
            <FaUser className="text-auralblue" />
            Full Name
          </label>
          <input
            {...register("fullName", { required: "Full name is required" })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auralblue"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-poppins mb-2">
            <FaEnvelope className="text-auralblue" />
            Email Address
          </label>
          <input
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auralblue"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-poppins mb-2">
            <FaPhone className="text-auralblue" />
            Phone Number
          </label>
          <input
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number"
              }
            })}
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auralblue"
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-poppins mb-2">
            <FaCalendar className="text-auralblue" />
            Preferred Date
          </label>
          <input
            {...register("date", { required: "Please select a date" })}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auralblue"
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 font-poppins mb-2">
            <FaComment className="text-auralblue" />
            Message (Optional)
          </label>
          <textarea
            {...register("message")}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auralblue resize-none"
            placeholder="Write your message here..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full text-center bg-auralblue text-white py-3 rounded-lg font-poppins hover:bg-opacity-90 transition-colors"
        >
          Book Your Appointment
        </motion.button>
      </div>
    </motion.form>
  );
};

export default AppointmentForm; 