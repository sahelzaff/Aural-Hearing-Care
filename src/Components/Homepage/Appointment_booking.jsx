'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaPhoneAlt, FaRegEnvelope, FaCheck, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import assets from '../../../public/assets/assets';
import '../../Components/Components.css';
import useAppointment from '@/hooks/useAppointment';

const AppointmentBooking = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        date_of_birth: '',
        gender: '',
        address: '',
        appointment_date: '',
        time_slot_id: '',
        sub_slot_id: '',
        selected_time: '',
        notes: ''
    });
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [lastBookingDetails, setLastBookingDetails] = useState(null);
    const [dateError, setDateError] = useState('');
    const [dateAvailability, setDateAvailability] = useState(null);
    
    // Use our custom appointment hook
    const { 
        timeSlots, 
        loading, 
        error,
        fetchTimeSlots,
        getTimeSlotById,
        getAvailabilityForDate,
        bookAppointment,
        formatTime
    } = useAppointment();

    useEffect(() => {
        // Fetch time slots when component mounts
        fetchTimeSlots();
    }, []);

    const isTimeSlotDisabled = (timeSlot) => {
        if (!dateAvailability) return true;
        
        // Check if the time slot exists and has any available sub-slots
        const slot = dateAvailability.timeSlots.find(slot => slot.id === timeSlot.id);
        if (!slot) return true;
        
        // A time slot is disabled if none of its sub-slots are available
        return !slot.subSlots.some(subSlot => subSlot.is_available);
    };

    const isSubSlotDisabled = (subSlot) => {
        return !subSlot.is_available;
    };

    const handleDateChange = async (e) => {
        const { name, value } = e.target; // Get input name and value
        const inputDate = value; // YYYY-MM-DD format from input
        
        if (name === 'appointment_date') {
            const selectedDate = new Date(inputDate);
            const today = new Date();
            
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                setDateError('Please select a future date');
                setFormData(prev => ({ ...prev, appointment_date: '' }));
                setDateAvailability(null);
                return;
            }
            
            setDateError('');
            setFormData(prev => ({ 
                ...prev, 
                appointment_date: inputDate,
                time_slot_id: '',
                sub_slot_id: '',
                selected_time: ''
            }));
            
            // Fetch availability for the selected date
            try {
                const availability = await getAvailabilityForDate(inputDate);
                setDateAvailability(availability);
            } catch (error) {
                console.error('Error fetching date availability:', error);
                toast.error('Failed to check availability for selected date');
            }
        } else {
            // For date of birth or any other date field
            setFormData(prev => ({ ...prev, [name]: value }));
            
            if (errorMessages[name]) {
                setErrorMessages(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'date_of_birth' || name === 'appointment_date') {
            handleDateChange(e);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (errorMessages[name]) {
            setErrorMessages(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({ ...prev, phone_number: value }));
        if (errorMessages.phone_number) {
            setErrorMessages(prev => ({ ...prev, phone_number: '' }));
        }
    };

    const validateStep = (step) => {
        const errors = {};
        if (step === 1) {
            if (!formData.first_name) errors.first_name = 'First name is required';
            if (!formData.last_name) errors.last_name = 'Last name is required';
            if (!formData.phone_number) errors.phone_number = 'Phone number is required';
            if (!formData.email) errors.email = 'Email is required';
            if (!formData.date_of_birth) errors.date_of_birth = 'Date of birth is required';
            if (!formData.gender) errors.gender = 'Gender is required';
            // Making address optional
            // if (!formData.address) errors.address = 'Address is required';
        } else if (step === 2) {
            if (!formData.appointment_date) errors.appointment_date = 'Date is required';
            if (!formData.time_slot_id) errors.time_slot_id = 'Time slot is required';
            if (!formData.sub_slot_id) errors.sub_slot_id = 'Specific time is required';
        } else if (step === 3) {
            // Notes are optional, no validation needed
        }
        return errors;
    };

    const handleNextStep = () => {
        const errors = validateStep(currentStep);
        if (Object.keys(errors).length === 0) {
            setCurrentStep(prev => prev + 1);
        } else {
            setErrorMessages(errors);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            phone_number: '',
            email: '',
            date_of_birth: '',
            gender: '',
            address: '',
            appointment_date: '',
            time_slot_id: '',
            sub_slot_id: '',
            selected_time: '',
            notes: ''
        });
        setCurrentStep(1);
        setErrorMessages({});
        setBookingSuccess(false);
        setLastBookingDetails(null);
        setDateAvailability(null);
    };

    const handleBookAnother = () => {
        resetForm();
    };

    const handleTimeSlotSelect = (slotId) => {
        setFormData(prev => ({ 
            ...prev, 
            time_slot_id: slotId,
            sub_slot_id: '',
            selected_time: ''
        }));
    };

    const handleSubSlotSelect = (subSlot) => {
        setFormData(prev => ({ 
            ...prev, 
            sub_slot_id: subSlot.id,
            selected_time: subSlot.display_name
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateStep(3);

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Call API to book appointment with formData
            const result = await bookAppointment(formData);
            console.log("API response:", result);

            if (result.success) {
                // Extract booking_id based on the API response structure
                // First check if it's in data.appointment.appointment.booking_id (nested structure)
                // Then fall back to data.appointment.booking_id if the first path doesn't exist
                const bookingId = 
                    (result.data?.appointment?.appointment?.booking_id) || 
                    (result.data?.appointment?.booking_id) || 
                    'N/A';
                
                console.log("Extracted booking ID:", bookingId);
                
                // Store booking details for confirmation with correct booking ID
                setLastBookingDetails({
                    ...formData,
                    bookingId: bookingId,
                    time_slot: result.data?.appointment?.time_slot || result.data?.appointment?.appointment?.time_slot || {},
                    sub_slot: result.data?.appointment?.sub_slot || result.data?.appointment?.appointment?.sub_slot || {}
                });

                setBookingSuccess(true);

                toast.success('Appointment Booked Successfully!', {
                    duration: 4000,
                    position: 'top-center',
                    icon: '🎉'
                });
            } else {
                toast.error(result.message || 'Failed to book appointment');
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const SuccessScreen = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center h-full flex flex-col justify-between py-3"
        >
            <div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                    className="relative w-24 h-24 mx-auto mb-4"
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ 
                            scale: [0.8, 1.1, 0.9, 1],
                            opacity: [0.5, 0.8, 0.6, 1]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                        }}
                        className="absolute inset-0 bg-green-100 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FaCheck className="text-green-500 text-4xl" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-1 font-outfit">Booking Confirmed!</h2>
                    <p className="text-gray-600 font-poppins text-sm">Your appointment has been successfully scheduled.</p>
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg p-4 mb-4 mx-auto shadow-md border border-gray-200 w-full"
            >
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-2">
                        <span className="text-gray-700 font-medium">Booking ID</span>
                        <span className="font-bold text-[#00a0dc] text-base font-mono tracking-wider">{lastBookingDetails.bookingId}</span>
                    </div>
                    
                    <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs">Name</span>
                        <span className="font-medium text-gray-800 text-sm truncate">{`${lastBookingDetails.first_name} ${lastBookingDetails.last_name}`}</span>
                    </div>
                    
                    <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs">Date</span>
                        <span className="font-medium text-gray-800 text-sm">
                            {new Date(lastBookingDetails.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    
                    <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-500 text-xs">Time</span>
                        <span className="font-medium text-gray-800 text-sm">{lastBookingDetails.selected_time}</span>
                    </div>
                    
                    <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                            <FaRegEnvelope className="text-[#00a0dc] mr-2" />
                            <span className="font-medium text-sm">Email Sent</span>
                        </div>
                        <span className="text-gray-500 text-xs truncate mt-1">
                            Confirmation sent to {lastBookingDetails.email}
                        </span>
                    </div>
                    
                    {lastBookingDetails.notes && (
                        <div className="col-span-2 flex flex-col bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-500 text-xs">Notes</span>
                            <span className="font-medium text-gray-800 text-sm mt-1">"{lastBookingDetails.notes}"</span>
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -5px rgba(0, 160, 220, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookAnother}
                className="bg-[#00a0dc] hover:bg-[#0092c9] text-white px-6 py-3 rounded-lg font-medium text-base shadow"
            >
                Book Another Appointment
            </motion.button>
        </motion.div>
    );

    // Update these classes to match the new color scheme
    const inputClasses = "w-full px-4 py-3 rounded-lg outline-none border border-gray-200 focus:border-[#00a0dc] transition-all duration-300 font-poppins text-gray-700";
    const labelClasses = "flex items-center gap-2 text-gray-600 font-poppins mb-1 text-sm";

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm"
                                    placeholder="Enter first name"
                                />
                                {errorMessages.first_name && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessages.first_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm"
                                    placeholder="Enter last name"
                                />
                                {errorMessages.last_name && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessages.last_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    max={new Date().toISOString().split('T')[0]} // Set max to today
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm ${
                                        errorMessages.date_of_birth ? 'border-red-500' : 'border-gray-200'
                                    }`}
                                />
                                {errorMessages.date_of_birth && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessages.date_of_birth}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm bg-white"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errorMessages.gender && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessages.gender}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <PhoneInput
                                country={'in'}
                                value={formData.phone_number}
                                onChange={handlePhoneChange}
                                containerClass="w-full"
                                inputStyle={{ 
                                    width: '100%',
                                    height: '38px',
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
                            {errorMessages.phone_number && (
                                <p className="text-red-500 text-xs mt-1">{errorMessages.phone_number}</p>
                            )}
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
                                className="w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm"
                                placeholder="Enter your email"
                            />
                            {errorMessages.email && (
                                <p className="text-red-500 text-xs mt-1">{errorMessages.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address <span className='text-[9px] ml-[2px] text-gray-400'>(Optional)</span>
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm"
                                placeholder="Enter your address"
                                rows="2"
                            />
                            {errorMessages.address && (
                                <p className="text-red-500 text-xs mt-1">{errorMessages.address}</p>
                            )}
                        </div>
                    </motion.div>
                );
                
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment Date
                            </label>
                            <input
                                type="date"
                                name="appointment_date"
                                value={formData.appointment_date}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]} // Set min to today
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-[#00a0dc] focus:border-[#00a0dc] text-sm ${
                                    dateError ? 'border-red-500' : 'border-gray-200'
                                }`}
                            />
                            {dateError && (
                                <p className="text-red-500 text-xs mt-1">{dateError}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClasses}>
                                <FaRegClock className="text-[#00a0dc]" />
                                Select Time Slot
                            </label>
                            {!formData.appointment_date && (
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='text-amber-500 text-xs mb-2'
                                >
                                    Please select a date first to view available time slots
                                </motion.p>
                            )}
                            
                            {formData.appointment_date && !dateAvailability && loading && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00a0dc]"></div>
                                </div>
                            )}
                            
                            {formData.appointment_date && error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}
                            
                            {dateAvailability && !formData.time_slot_id && (
                                <div className='grid grid-cols-1 gap-2 mt-2'>
                                    <p className='text-xs text-gray-600 mb-1'>Select a time slot to begin:</p>
                                    {dateAvailability.timeSlots.map((slot) => {
                                        const isDisabled = isTimeSlotDisabled(slot);
                                        const availableCount = slot.subSlots.filter(subSlot => subSlot.is_available).length;
                                        
                                        return (
                                            <motion.button
                                                key={slot.id}
                                                type="button"
                                                onClick={() => !isDisabled && handleTimeSlotSelect(slot.id)}
                                                className={`group relative overflow-hidden flex items-center justify-between p-2 rounded-lg border transition-all duration-300 ${
                                                    isDisabled 
                                                        ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                                                        : formData.time_slot_id === slot.id
                                                            ? 'border-[#00a0dc] bg-gradient-to-r from-blue-50 to-indigo-50'
                                                            : 'border-gray-200 hover:border-[#00a0dc] bg-white hover:bg-blue-50'
                                                }`}
                                                whileHover={!isDisabled && { 
                                                    scale: 1.02,
                                                    transition: { duration: 0.2 } 
                                                }}
                                                whileTap={!isDisabled && { scale: 0.98 }}
                                                disabled={isDisabled}
                                            >
                                                <div className="flex items-center">
                                                    <span className={`flex items-center justify-center w-7 h-7 rounded-full mr-2 ${
                                                        isDisabled 
                                                            ? 'bg-gray-200 text-gray-400' 
                                                            : 'bg-[#00a0dc] bg-opacity-10 text-[#00a0dc]'
                                                    }`}>
                                                        <FaRegClock className="text-xs" />
                                                    </span>
                                                    <div className="flex flex-col items-start">
                                                        <span className={`font-medium text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                                                            {slot.slot_name.charAt(0).toUpperCase() + slot.slot_name.slice(1)}
                                                        </span>
                                                        <span className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                {isDisabled ? (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-500">Not Available</span>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 mr-1">
                                                            {availableCount} {availableCount === 1 ? 'Slot' : 'Slots'}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {!isDisabled && (
                                                    <motion.div 
                                                        className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 opacity-0 group-hover:opacity-10"
                                                        initial={{ x: "-100%" }}
                                                        whileHover={{ x: "100%" }}
                                                        transition={{ duration: 1, repeat: Infinity, repeatType: "mirror" }}
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}

                            {dateAvailability && formData.time_slot_id && (
                                <div className='space-y-2 mt-3 pt-2 border-t border-gray-100'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='text-sm font-medium text-gray-700 flex items-center'>
                                            <FaRegClock className="text-[#00a0dc] mr-2 text-xs" />
                                            Available Times
                                        </h3>
                                        <motion.button 
                                            onClick={() => setFormData(prev => ({ ...prev, time_slot_id: '', sub_slot_id: '', selected_time: '' }))}
                                            className='text-xs text-[#00a0dc] hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full'
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 0L7.06 1.06L2.87 5.25H12V6.75H2.87L7.06 10.94L6 12L0 6L6 0Z" fill="currentColor"/>
                                            </svg>
                                            Change
                                        </motion.button>
                                    </div>
                                    
                                    <div className='grid grid-cols-3 gap-1'>
                                        {dateAvailability.timeSlots
                                            .find(slot => slot.id === formData.time_slot_id)?.subSlots
                                            .filter(subSlot => subSlot.is_available)
                                            .map((subSlot) => (
                                                <motion.button
                                                    key={subSlot.id}
                                                    type="button"
                                                    onClick={() => handleSubSlotSelect(subSlot)}
                                                    className={`relative overflow-hidden p-2 rounded-lg text-xs transition-all duration-300 font-poppins
                                                        ${formData.sub_slot_id === subSlot.id
                                                            ? 'bg-gradient-to-r from-[#00a0dc] to-[#0092c9] text-white shadow-md' 
                                                            : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00a0dc] hover:shadow-sm'
                                                        }`}
                                                    whileHover={{ 
                                                        scale: 1.05,
                                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <span className="block text-center font-medium">
                                                        {subSlot.display_name}
                                                    </span>
                                                    
                                                    {formData.sub_slot_id === subSlot.id && (
                                                        <motion.div 
                                                            className="absolute inset-0 bg-gradient-to-r from-[#00a0dc] to-[#0092c9] -z-10"
                                                            animate={{ 
                                                                backgroundPosition: ["0% center", "100% center"]
                                                            }}
                                                            transition={{ 
                                                                duration: 3,
                                                                repeat: Infinity,
                                                                repeatType: "mirror"
                                                            }}
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                    </div>
                                    
                                    {dateAvailability.timeSlots
                                        .find(slot => slot.id === formData.time_slot_id)?.subSlots
                                        .filter(subSlot => subSlot.is_available).length === 0 && (
                                        <div className="text-center bg-red-50 rounded-lg p-2">
                                            <p className="text-red-500 text-xs font-medium">No available times in this slot.</p>
                                            <p className="text-red-400 text-[10px] mt-1">Please select a different time slot.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
                
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="bg-blue-50 p-2 rounded-lg mb-3">
                            <div className="flex items-center mb-2">
                                <FaRegCalendarAlt className="text-[#00a0dc] mr-2" />
                                <h3 className="font-medium text-gray-800">Appointment Summary</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Date</p>
                                    <p className="font-medium text-gray-800">
                                        {new Date(formData.appointment_date + 'T00:00:00').toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Time</p>
                                    <p className="font-medium text-gray-800">{formData.selected_time}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label className="flex items-center gap-1 text-gray-600 font-poppins mb-1 text-sm">
                                <FaStickyNote className="text-[#00a0dc] text-xs" />
                                Notes for your appointment <span className="text-[9px] text-gray-400 ml-1">(Optional)</span>
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Add any notes or special requests for your appointment"
                                className={`w-full px-3 py-2 rounded-lg outline-none border border-gray-200 focus:border-[#00a0dc] transition-all duration-300 font-poppins text-gray-700`}
                                rows="2"
                            />
                            
                            {/* Recommendation chips - more compact styling */}
                            <div className="mt-1 mb-2">
                                <p className="text-xs text-gray-600 mb-1">Quick add to notes:</p>
                                <div className="flex flex-wrap gap-1">
                                    {["First visit", "Hearing test", "Hearing aid fitting", "Hearing aid repair", 
                                      "Battery replacement", "Ear cleaning", "Tinnitus consultation", "Follow-up appointment"].map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                // Append suggestion to existing notes
                                                const currentNotes = formData.notes.trim();
                                                const newNotes = currentNotes 
                                                    ? currentNotes + (currentNotes.endsWith('.') ? ' ' : '. ') + suggestion
                                                    : suggestion;
                                                setFormData(prev => ({ ...prev, notes: newNotes }));
                                            }}
                                            className="bg-blue-50 hover:bg-blue-100 text-[#00a0dc] border border-blue-200 rounded-full px-1.5 py-0.5 text-[10px]"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            + {suggestion}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1">
                                Please share any specific concerns or requirements you may have for your appointment.
                            </p>
                        </div>
                    </motion.div>
                );
                
            default:
                return null;
        }
    };

    // Add this CSS class within the component for consistent button styling
    const buttonClasses = "w-full bg-[#00a0dc] hover:bg-[#0092c9] text-white py-3 rounded-lg transition-colors text-sm font-medium";
    const backButtonClasses = "w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition-colors text-sm font-medium";

    return (
        <div id="appointment-booking" className="relative w-full min-h-[600px] bg-gray-50 py-8">
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

            {/* Appointment Booking Card - Fixed height with no scrollbar */}
            <div className="relative max-w-md mx-auto lg:ml-20 lg:mr-auto">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow-lg p-5 w-[420px] h-[640px] flex flex-col overflow-hidden" // Increased height more and reduced padding
                >
                    {!bookingSuccess ? (
                        <>
                            <div className="flex-1 flex flex-col">
                                <h2 className="text-2xl font-outfit font-bold text-center text-[#B4CC51]">
                                    Schedule Your Appointment
                                </h2>
                                <p className="text-gray-600 text-center mb-3 font-poppins text-sm">
                                    Book your hearing consultation with our experts
                                </p>

                                {/* Form Steps with Progress Line */}
                                <div className="mb-5 relative">
                                    <div className="flex items-center justify-between relative">
                                        {/* Progress Line */}
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200">
                                            <div 
                                                className="h-full bg-[#00a0dc] transition-all duration-300"
                                                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                                            />
                                        </div>
                                        
                                        {/* Step Indicators */}
                                        {[1, 2, 3].map((step) => (
                                            <div
                                                key={step}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                                                    currentStep === step
                                                            ? 'bg-[#00a0dc] text-white'
                                                            : currentStep > step
                                                        ? 'bg-[#00a0dc] text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}
                                            >
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Form Content - WITH scrollbar for proper overflow handling */}
                                <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                                    {renderStepContent()}
                                </div>
                                
                                {/* Buttons consistently positioned at bottom */}
                                <div className="mt-auto pt-2">
                                    {currentStep === 1 ? (
                                        <button
                                            onClick={handleNextStep}
                                            className={buttonClasses}
                                        >
                                            Next
                                        </button>
                                    ) : currentStep === 2 ? (
                                        <div className='flex gap-3'>
                                            <motion.button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className={backButtonClasses}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={handleNextStep}
                                                disabled={!formData.appointment_date || !formData.time_slot_id || !formData.sub_slot_id}
                                                className={`${buttonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Next
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className='flex gap-3'>
                                            <motion.button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className={backButtonClasses}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                                className={`${buttonClasses} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                {isSubmitting ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Booking...
                                                    </span>
                                                ) : "Book Appointment"}
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <SuccessScreen />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
