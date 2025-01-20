'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaPhoneAlt, FaRegEnvelope, FaCheck } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import assets from '../../../public/assets/assets';
import '../../Components/Components.css';

const timeSlots = {
    morning: [
        "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"
    ],
    afternoon: [
        "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM"
    ],
    evening: [
        "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"
    ]
};

const timePeriods = [
    { id: 'morning', label: 'Morning', time: '9:00 AM - 11:30 AM', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 3:00 PM', icon: '☀️' },
    { id: 'evening', label: 'Evening', time: '3:30 PM - 5:30 PM', icon: '🌇' }
];

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        timeSlot: '',
        selectedPeriod: '',
        gender: '',
        age: ''
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
        const selectedDate = new Date(formData.date.split('-').reverse().join('-'));
        
        // If selected date is today, check time
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

            // Check if this time slot is in the past
            if (compareHour < currentHour || (compareHour === currentHour && slotMinute <= currentMinutes)) {
                return true;
            }
        }

        return bookedTimeSlots[formData.date]?.[timeSlot] || false;
    };

    const isTimePeriodDisabled = (periodId) => {
        if (!formData.date) return false;
        
        const today = new Date();
        const selectedDate = new Date(formData.date.split('-').reverse().join('-'));
        
        // Only check for current day
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const currentMinutes = today.getMinutes();
            
            // Check each period's end time
            switch (periodId) {
                case 'morning':
                    // Morning ends at 11:30 AM
                    return (currentHour > 11 || (currentHour === 11 && currentMinutes > 30));
                case 'afternoon':
                    // Afternoon ends at 3:00 PM
                    return currentHour >= 15;
                case 'evening':
                    // Evening ends at 5:30 PM
                    return (currentHour > 17 || (currentHour === 17 && currentMinutes > 30));
                default:
                    return false;
            }
        }
        
        return false;
    };

    const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const [day, month, year] = dateStr.split('-');
        return `${year}-${month}-${day}`; // Format for input type="date"
    };

    const formatDateForDisplay = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`; // Format for display/storage
    };

    const handleDateChange = (e) => {
        const inputDate = e.target.value; // YYYY-MM-DD format from input
        const selectedDate = new Date(inputDate);
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            setDateError('Please select a future date');
            setFormData(prev => ({ ...prev, date: '' }));
            return;
        }
        
        setDateError('');
        const formattedDate = formatDateForDisplay(inputDate);
        setFormData(prev => ({ ...prev, date: formattedDate }));
        
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
            if (!formData.age) errors.age = 'Age is required';
            if (!formData.gender) errors.gender = 'Gender is required';
        } else if (step === 2) {
            if (!formData.date) errors.date = 'Date is required';
            if (!formData.timeSlot) errors.timeSlot = 'Time Slot is required';
            if (bookedTimeSlots[formData.date]?.[formData.timeSlot]) errors.timeSlot = 'Selected time slot is already booked';
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
            timeSlot: '',
            selectedPeriod: '',
            gender: '',
            age: ''
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
                [formData.date]: {
                    ...prev[formData.date],
                    [formData.timeSlot]: 'booked'
                }
            }));

            const formattedDate = formData.date.split('-').reverse().join('-'); // Convert DD-MM-YYYY to YYYY-MM-DD
            
            // Store booking details for confirmation
            setLastBookingDetails({
                ...formData,
                date: formattedDate,
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
            className="text-center py-6"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20 
                }}
                className="relative w-24 h-24 mx-auto mb-6"
            >
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <FaCheck className="text-green-500 text-4xl" />
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-2 font-outfit">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6 font-poppins">Your appointment has been successfully scheduled.</p>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-xl p-6 mb-6 max-w-md mx-auto shadow-sm"
            >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 font-outfit flex items-center justify-center">
                    <FaRegCalendarAlt className="mr-2 text-auralblue" />
                    Appointment Details
                </h3>
                <div className="space-y-3 text-left">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Booking ID</span>
                        <span className="font-medium text-gray-800">{lastBookingDetails.bookingId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium text-gray-800">{lastBookingDetails.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-gray-800">
                            {new Date(lastBookingDetails.date.split('-').reverse().join('-')).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium text-gray-800">{lastBookingDetails.timeSlot}</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4 mb-6"
            >
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-poppins">
                        <span className="block font-medium mb-1">📧 Email Confirmation</span>
                        A detailed confirmation has been sent to {lastBookingDetails.email}
                    </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 font-poppins">
                        <span className="block font-medium mb-1">📱 SMS Reminder</span>
                        We'll send a reminder to {lastBookingDetails.phone} 24 hours before your appointment
                    </p>
                </div>
            </motion.div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookAnother}
                className="bg-auralblue text-white px-8 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-300 shadow-sm mx-auto"
            >
                Book Another Appointment
            </motion.button>
        </motion.div>
    );

    const inputClasses = "w-full px-5 py-4 rounded-xl outline-none border-2 border-gray-200 focus:border-auralblue transition-all duration-300 font-poppins text-gray-700";
    const labelClasses = "flex items-center gap-2 text-gray-600 font-poppins mb-2";

    return (
        <div id="appointment-booking" className="relative w-full min-h-[500px] bg-gray-50 py-8">
            {/* Background Image and Text Section */}
            <div className="absolute inset-0 w-full h-full">
                <div className="relative w-full h-full">
                    <img 
                        src={assets.appointment_bg_2} 
                        alt="Hearing Consultation"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white px-10 w-1/2">
                        <h2 className="text-4xl font-outfit font-bold mb-4">
                            Expert Hearing Care
                        </h2>
                        <p className="text-lg font-poppins mb-6">
                            Schedule your consultation with our experienced audiologists. 
                            We provide personalized hearing solutions tailored to your needs.
                        </p>
                        <ul className="space-y-3 font-poppins">
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Comprehensive Hearing Assessment
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Expert Consultation
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✓</span> Personalized Care Plan
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Appointment Booking Card */}
            <div className="relative max-w-md mx-auto lg:ml-20 lg:mr-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow-lg p-6 w-[460px] h-[560px]"
                >
                    {!bookingSuccess ? (
                        <>
                            <div className="flex flex-col h-full">
                            <h2 className="text-2xl font-outfit font-bold text-center text-auralyellow">
                                Schedule Your Appointment
                            </h2>
                            <p className="text-gray-600 text-center mb-6 font-poppins text-sm">
                                Book your hearing consultation with our experts
                            </p>

                                {/* Form Steps with Progress Line */}
                                <div className="mb-6 relative">
                                    <div className="flex items-center justify-between relative">
                                        {/* Progress Line */}
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200">
                                            <div 
                                                className="h-full bg-auralblue transition-all duration-300"
                                                style={{ width: currentStep === 1 ? '0%' : '100%' }}
                                            />
                                        </div>
                                        
                                        {/* Step Indicators */}
                                    {[1, 2].map((step) => (
                                        <div
                                            key={step}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                                                currentStep === step
                                                        ? 'bg-auralblue text-white'
                                                        : currentStep > step
                                                    ? 'bg-auralblue text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>

                                {/* Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                            {currentStep === 1 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4 flex flex-col h-full"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-auralblue focus:border-auralblue text-sm"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                min="0"
                                                max="120"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-auralblue focus:border-auralblue text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="Enter your age"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-auralblue focus:border-auralblue text-sm bg-white"
                                            >
                                                <option value="">Select gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <PhoneInput
                                            country={'in'}
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            containerClass="w-full"
                                            inputStyle={{ 
                                                width: '100%',
                                                height: '42px',
                                                fontSize: '14px',
                                                padding: '8px 12px 8px 48px',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: 'white'
                                            }}
                                            buttonStyle={{
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px 0 0 8px',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-auralblue focus:border-auralblue text-sm"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div className="flex-grow"></div>

                                    <button
                                        onClick={handleNextStep}
                                        className="w-full bg-auralblue text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors text-sm mt-4"
                                    >
                                        Next
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-4 flex-1 flex flex-col"
                                >
                                    <div>
                                        <label className={labelClasses}>
                                            <FaRegCalendarAlt className="text-auralblue" />
                                            Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formatDateForInput(formData.date)}
                                            onChange={handleDateChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`${inputClasses} date-input-custom`}
                                            pattern="\d{2}-\d{2}-\d{4}"
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
                                        
                                        {formData.date && !formData.selectedPeriod && (
                                            <div className='grid grid-cols-3 gap-4'>
                                                {timePeriods.map((period) => {
                                                    const isDisabled = isTimePeriodDisabled(period.id);
                                                    return (
                                                        <motion.button
                                                            key={period.id}
                                                            type="button"
                                                            onClick={() => !isDisabled && setFormData(prev => ({ ...prev, selectedPeriod: period.id, timeSlot: '' }))}
                                                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 ${
                                                                isDisabled 
                                                                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60' 
                                                                    : 'border-gray-200 hover:border-auralblue bg-gray-50 hover:bg-gray-100'
                                                            }`}
                                                            whileHover={!isDisabled && { scale: 1.02 }}
                                                            whileTap={!isDisabled && { scale: 0.98 }}
                                                            disabled={isDisabled}
                                                        >
                                                            <span className="text-xl mb-1">{period.icon}</span>
                                                            <span className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                                                {period.label}
                                                            </span>
                                                            <span className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {period.time}
                                                            </span>
                                                            {isDisabled && (
                                                                <span className="text-xs text-red-400 mt-1">Not Available</span>
                                                            )}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {formData.date && formData.selectedPeriod && (
                                            <div className='space-y-3'>
                                                <div className='flex items-center justify-between'>
                                                    <h3 className='text-sm font-medium text-gray-700'>
                                                        {timePeriods.find(p => p.id === formData.selectedPeriod)?.label} Slots
                                                    </h3>
                                                    <button 
                                                        onClick={() => setFormData(prev => ({ ...prev, selectedPeriod: '', timeSlot: '' }))}
                                                        className='text-[10px] text-auralblue hover:underline bg-white px-2 py-1 rounded-none hover:bg-white'
                                                    >
                                                        Change Time Period
                                                    </button>
                                                </div>
                                                <div className='grid grid-cols-4 gap-2'>
                                                    {timeSlots[formData.selectedPeriod].map((timeSlot, index) => (
                                                        <motion.button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, timeSlot }))}
                                                            className={`px-3 py-2 rounded-lg text-xs transition-all duration-300 font-poppins w-[90px]
                                                                ${formData.timeSlot === timeSlot 
                                                                    ? 'bg-auralblue text-white border-auralblue' 
                                                                    : isTimeSlotDisabled(timeSlot)
                                                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-auralblue hover:bg-auralblue hover:text-white'
                                                                }`}
                                                            disabled={isTimeSlotDisabled(timeSlot)}
                                                            whileHover={!isTimeSlotDisabled(timeSlot) && { scale: 1.02 }}
                                                            whileTap={!isTimeSlotDisabled(timeSlot) && { scale: 0.98 }}
                                                        >
                                                            {timeSlot}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='flex gap-4 mt-auto'>
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
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || !formData.date || !formData.timeSlot}
                                            className='flex-1 py-4 bg-auralblue text-white rounded-xl font-medium transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? 'Booking...' : 'Book Appointment'}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                        <SuccessScreen />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AppointmentForm;
