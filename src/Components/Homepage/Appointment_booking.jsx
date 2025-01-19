'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaPhoneAlt, FaRegEnvelope, FaCheck } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9; 
    const minute = (i % 2) * 30;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute === 0 ? '00' : '30'} ${period}`;
});

const AppointmentBooking = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [bookedTimeSlots, setBookedTimeSlots] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [lastBookingDetails, setLastBookingDetails] = useState(null);
    const [dateError, setDateError] = useState('');

    useEffect(() => {
        const storedBookedSlots = JSON.parse(localStorage.getItem('bookedTimeSlots')) || {};
        setBookedTimeSlots(storedBookedSlots);
    }, []);

    useEffect(() => {
        localStorage.setItem('bookedTimeSlots', JSON.stringify(bookedTimeSlots));
    }, [bookedTimeSlots]);

    const isTimeSlotDisabled = (timeSlot) => {
        if (!formData.date) return true;
        
        const today = new Date();
        const selectedDate = new Date(formData.date);
        
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const currentMinutes = today.getMinutes();
            
            const [slotTime, period] = timeSlot.split(' ');
            const [slotHour, slotMinute] = slotTime.split(':').map(num => parseInt(num));
            let compareHour = slotHour;
            
            if (period === 'PM' && slotHour !== 12) {
                compareHour = slotHour + 12;
            } else if (period === 'AM' && slotHour === 12) {
                compareHour = 0;
            }

            if (compareHour < currentHour || (compareHour === currentHour && slotMinute <= currentMinutes)) {
                return true;
            }
        }

        return bookedTimeSlots[timeSlot] || false;
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            setDateError('Please select a future date');
            setFormData(prev => ({ ...prev, date: '' }));
            return;
        }
        
        setDateError('');
        setFormData(prev => ({ ...prev, date: e.target.value }));
        
        if (formData.timeSlot) {
            setFormData(prev => ({ ...prev, timeSlot: '' }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'date') {
            handleDateChange(e);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errorMessages[name]) {
            setErrorMessages(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({ ...prev, phone: value }));
        if (errorMessages.phone) {
            setErrorMessages(prev => ({ ...prev, phone: '' }));
        }
    };

    const validateStep = (step) => {
        const errors = {};
        if (step === 1) {
        if (!formData.name) errors.name = 'Full Name is required';
        if (!formData.phone) errors.phone = 'Phone Number is required';
        if (!formData.email) errors.email = 'Email is required';
        } else if (step === 2) {
        if (!formData.date) errors.date = 'Date is required';
        if (!formData.timeSlot) errors.timeSlot = 'Time Slot is required';
        if (bookedTimeSlots[formData.timeSlot]) errors.timeSlot = 'Selected time slot is already booked';
        }
        return errors;
    };

    const handleNextStep = () => {
        const errors = validateStep(currentStep);
        if (Object.keys(errors).length === 0) {
            setCurrentStep(2);
        } else {
            setErrorMessages(errors);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            email: '',
            date: '',
            timeSlot: ''
        });
        setCurrentStep(1);
        setErrorMessages({});
        setBookingSuccess(false);
        setLastBookingDetails(null);
    };

    const handleBookAnother = () => {
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateStep(2);

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
        
        setBookedTimeSlots((prev) => ({
            ...prev,
            [formData.timeSlot]: 'booked'
        }));

            // Store booking details for confirmation
            setLastBookingDetails({
                ...formData,
                bookingId: Math.random().toString(36).substr(2, 9).toUpperCase()
            });

            setBookingSuccess(true);

            toast.success('Appointment Booked Successfully!', {
                duration: 4000,
                position: 'top-center',
                icon: '🎉'
            });
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const SuccessScreen = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                }}
                className="w-24 h-24 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center"
            >
                <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <FaCheck className="text-green-500 text-4xl" />
                </motion.div>
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4 font-outfit">Thank You!</h2>
            <p className="text-gray-600 mb-8 font-poppins">Your appointment has been successfully booked.</p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit">Appointment Details</h3>
                <div className="space-y-3 text-left">
                    <p className="flex justify-between">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-medium">{lastBookingDetails.bookingId}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{lastBookingDetails.name}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(lastBookingDetails.date).toLocaleDateString()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{lastBookingDetails.timeSlot}</span>
                    </p>
                </div>
            </div>

            <p className="text-sm text-gray-500 mb-6 font-poppins">
                A confirmation email and SMS have been sent with your appointment details.
            </p>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookAnother}
                className="bg-auralblue text-white px-8 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-300"
            >
                Book Another Appointment
            </motion.button>
        </motion.div>
    );

    const inputClasses = "w-full px-5 py-4 rounded-xl outline-none border-2 border-gray-200 focus:border-auralblue transition-all duration-300 font-poppins text-gray-700";
    const labelClasses = "flex items-center gap-2 text-gray-600 font-poppins mb-2";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='w-full min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8'
        >
            <Toaster />

            <div className='max-w-4xl mx-auto'>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-center mb-12'
                >
                    <h1 className='font-outfit text-5xl text-auralyellow font-bold mb-4'>
                        Schedule Your Appointment
                    </h1>
                    <p className='text-gray-600 font-poppins'>
                        Book your hearing consultation with our experts
                    </p>
                </motion.div>

                <motion.div 
                    className='bg-white rounded-2xl shadow-lg p-8'
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <AnimatePresence mode="wait">
                        {bookingSuccess ? (
                            <SuccessScreen />
                        ) : (
                            <>
                    <div className='mb-8'>
                        <div className='flex justify-between items-center relative'>
                            {[1, 2].map((step) => (
                                <motion.div
                                    key={step}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                        step <= currentStep ? 'bg-auralblue text-white' : 'bg-gray-200'
                                    } transition-colors duration-300`}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {step}
                                </motion.div>
                            ))}
                                        <div className='absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10'>
                                <motion.div 
                                    className='h-full bg-auralblue'
                                    initial={{ width: '0%' }}
                                    animate={{ width: currentStep === 1 ? '0%' : '100%' }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                            {currentStep === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='space-y-6'
                                >
                                    <div>
                                        <label htmlFor="name" className={labelClasses}>
                                            <FaRegUser className="text-auralblue" />
                                            Full Name
                                        </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                            placeholder='Enter your full name'
                                            className={inputClasses}
                                        />
                                        {errorMessages.name && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-sm mt-1'
                                            >
                                                {errorMessages.name}
                                            </motion.p>
                                        )}
                        </div>

                                    <div>
                                        <label htmlFor="phone" className={labelClasses}>
                                            <FaPhoneAlt className="text-auralblue" />
                                            Phone Number
                                        </label>
                            <PhoneInput
                                country={'in'}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                inputClass={`!w-full !h-[50px] !text-base !border-2 !border-gray-200 !rounded-xl !pl-[72px] focus:!border-auralblue focus:!ring-2 focus:!ring-auralblue focus:!ring-opacity-20 !outline-none`}
                                containerClass="!w-full !relative"
                                buttonClass={`!absolute !left-3 !top-1/2 !-translate-y-1/2 !border-0 !bg-transparent !w-[45px] !h-[30px] !p-0 !rounded-none hover:!bg-transparent before:!hidden after:!hidden`}
                                dropdownClass="!rounded-lg !shadow-lg !mt-1 !border !border-gray-200"
                                searchClass="!rounded-lg !my-2"
                                enableSearch
                                disableSearchIcon
                                countryCodeEditable={false}
                                inputProps={{
                                    id: 'phone',
                                    name: 'phone',
                                    required: true,
                                    placeholder: 'Enter phone number'
                                }}
                                buttonStyle={{
                                    background: 'transparent',
                                    border: 'none',
                                    position: 'absolute'
                                }}
                            />
                            {errorMessages.phone && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-red-500 text-sm mt-1'
                                >
                                    {errorMessages.phone}
                                </motion.p>
                            )}
                        </div>

                                    <div>
                                        <label htmlFor="email" className={labelClasses}>
                                            <FaRegEnvelope className="text-auralblue" />
                                            Email Address
                                        </label>
                            <input
                                            type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                            placeholder='Enter your email address'
                                            className={inputClasses}
                                        />
                                        {errorMessages.email && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-sm mt-1'
                                            >
                                                {errorMessages.email}
                                            </motion.p>
                                        )}
                        </div>

                                    <motion.button
                                        type="button"
                                        onClick={handleNextStep}
                                        className='w-full py-4 bg-auralblue text-white rounded-xl font-medium transition-all duration-300 hover:bg-opacity-90'
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Continue
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className='space-y-6'
                                >
                                    <div>
                                        <label htmlFor="date" className={labelClasses}>
                                            <FaRegCalendarAlt className="text-auralblue" />
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={inputClasses}
                                        />
                                        {dateError && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-sm mt-1'
                                            >
                                                {dateError}
                                            </motion.p>
                                        )}
                                        {errorMessages.date && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-sm mt-1'
                                            >
                                                {errorMessages.date}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClasses}>
                                            <FaRegClock className="text-auralblue" />
                                            Select Time Slot
                                        </label>
                                        {!formData.date && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-amber-500 text-sm mb-2'
                                            >
                                                Please select a date first to view available time slots
                                            </motion.p>
                                        )}
                                        <div className='grid grid-cols-4 gap-3'>
                                            {timeSlots.map((timeSlot, index) => (
                                                <motion.button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, timeSlot }))}
                                                    className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-poppins
                                                        ${formData.timeSlot === timeSlot 
                                                            ? 'bg-auralblue text-white border-auralblue' 
                                                            : isTimeSlotDisabled(timeSlot)
                                                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray hover:bg-auralblue hover:text-white'
                                                        }`}
                                                    disabled={isTimeSlotDisabled(timeSlot)}
                                                    whileHover={!isTimeSlotDisabled(timeSlot) && { scale: 1.05 }}
                                                    whileTap={!isTimeSlotDisabled(timeSlot) && { scale: 0.95 }}
                                                >
                                                    {timeSlot}
                                                </motion.button>
                                            ))}
                                        </div>
                                        {errorMessages.timeSlot && (
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className='text-red-500 text-sm mt-2'
                                            >
                                                {errorMessages.timeSlot}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className='flex gap-4'>
                                        <motion.button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className='flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:bg-gray-200'
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Back
                                        </motion.button>
                                        <motion.button
                            type="submit"
                                            disabled={isSubmitting}
                                            className='flex-1 py-4 bg-auralblue text-white rounded-xl font-medium transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                        >
                                            {isSubmitting ? 'Booking...' : 'Book Appointment'}
                                        </motion.button>
                    </div>
                                </motion.div>
                                    )}
                </form>
                                </>
                            )}
                        </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AppointmentBooking;
