'use client';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9; // 9 AM to 7 PM
    const minute = (i % 2) * 30;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute === 0 ? '00' : '30'} ${period}`;
});

const Specialized = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        timeSlot: ''
    });
    const [bookedTimeSlots, setBookedTimeSlots] = useState({});
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        // Load booked time slots from local storage
        const storedBookedSlots = JSON.parse(localStorage.getItem('bookedTimeSlots')) || {};
        setBookedTimeSlots(storedBookedSlots);
    }, []);

    useEffect(() => {
        // Store booked time slots in local storage
        localStorage.setItem('bookedTimeSlots', JSON.stringify(bookedTimeSlots));
    }, [bookedTimeSlots]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        if (!formData.name) errors.name = 'Full Name is required';
        if (!formData.phone) errors.phone = 'Phone Number is required';
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.date) errors.date = 'Date is required';
        if (!formData.timeSlot) errors.timeSlot = 'Time Slot is required';
        if (bookedTimeSlots[formData.timeSlot]) errors.timeSlot = 'Selected time slot is already booked';

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }

        // Mark time slot as booked
        setBookedTimeSlots((prev) => ({
            ...prev,
            [formData.timeSlot]: 'booked'
        }));

        // Show toast notification
        toast.success('Appointment Booked Successfully');

        // Reset form and state
        setFormData({
            name: '',
            phone: '',
            email: '',
            date: '',
            timeSlot: ''
        });

        setErrorMessages({});
    };

    return (
        <div className='w-full pt-20 h-full pb-10'>
            <Toaster position="top-center" />

            <div className='flex flex-col items-center'>
                <h1 className='font-outfit text-5xl text-auralyellow font-bold'>Schedule Your Appointment Now</h1>

                <form onSubmit={handleSubmit} className='w-full max-w-4xl pt-10'>
                    <div className='grid grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 gap-y-5 gap-x-10'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor="name" className='ml-4 text-sm font-poppins'>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder='Enter Your Name'
                                className='w-[450px] px-5 py-3 rounded-3xl outline-none border-[1px] border-auralblue'
                            />
                            {errorMessages.name && <p className='text-red-500 text-sm'>{errorMessages.name}</p>}
                        </div>

                        <div className='flex flex-col items-start'>
                            <label htmlFor="phone" className='ml-4 text-sm font-poppins'>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder='Enter Your Phone Number'
                                className='w-[450px] px-5 py-3 rounded-3xl outline-none border-[1px] border-auralblue'
                            />
                            {errorMessages.phone && <p className='text-red-500 text-sm'>{errorMessages.phone}</p>}
                        </div>

                        <div className='flex flex-col items-start'>
                            <label htmlFor="email" className='ml-4 text-sm font-poppins'>Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder='Enter Your Email'
                                className='w-[450px] px-5 py-3 rounded-3xl outline-none border-[1px] border-auralblue'
                            />
                            {errorMessages.email && <p className='text-red-500 text-sm'>{errorMessages.email}</p>}
                        </div>

                        <div className='flex flex-col items-start'>
                            <label htmlFor="date" className='ml-4 text-sm font-poppins'>Pick a Date</label>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className='w-[450px] px-5 py-3 rounded-3xl outline-none border-[1px] text-gray-400 border-auralblue'
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errorMessages.date && <p className='text-red-500 text-sm'>{errorMessages.date}</p>}
                        </div>
                    </div>

                    {/* Time Slots Section */}
                    <div className='pt-10'>
                        <h2 className='font-outfit text-3xl text-auralyellow font-bold mb-4'>Select Time Slots</h2>
                        <div className='grid grid-cols-7 gap-4 place-content-center'>
                            {timeSlots.map((timeSlot, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, timeSlot }))}
                                    className={`px-4 py-2 border-[1px] rounded-full transition-colors duration-300 ease-in-out
                                    ${formData.timeSlot === timeSlot ? 'bg-auralblue text-white' :
                                    bookedTimeSlots[timeSlot] ? 'bg-gray-400 text-gray-200 line-through' : 'bg-white text-auralblue border-auralblue hover:bg-auralblue hover:text-white'}`}
                                    disabled={bookedTimeSlots[timeSlot]}
                                >
                                    {timeSlot}
                                </button>
                            ))}
                        </div>
                        {errorMessages.timeSlot && <p className='text-red-500 text-sm mt-2'>{errorMessages.timeSlot}</p>}
                    </div>

                    <div className='flex justify-center mt-10'>
                        <button
                            type="submit"
                            className='px-6 py-3 bg-auralblue text-white rounded-lg transition-colors duration-300 ease-in-out hover:bg-auralblue-light'
                        >
                            Book Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Specialized;
