'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useLenis from '@/app/Hooks/uselenis';
import { FaFacebook, FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";
import assets from '../../../public/assets/assets';

const Footer = () => {
    useLenis(); // Enable smooth scrolling

    const { register, handleSubmit, watch, formState: { isSubmitted } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        setFormSubmitted(true);
    };

    return (
        <div>

            <div
                className="relative h-auto py-20 overflow-hidden bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url(${assets.request_callback})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex items-center justify-center h-full w-full">
                    {!formSubmitted ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white text-black py-10 w-[600px] px-10 rounded-lg shadow-lg h-auto">
                            <h2 className="text-4xl font-semibold font-outfit text-center text-auralyellow">Request a Call Back</h2>
                            <div className="mt-4">
                                <label className="block mb-1 text-sm font-medium font-poppins">Name</label>
                                <input
                                    {...register('name', { required: true })}
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${watch('name') ? 'border-auralyellow' : 'border-gray-300'
                                        } focus:border-auralyellow`}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-1 text-sm font-medium font-poppins">Email</label>
                                <input
                                    {...register('email', { required: true })}
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${watch('email') ? 'border-auralyellow' : 'border-gray-300'
                                        } focus:border-auralyellow`}
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-1 text-sm font-medium font-poppins">Phone Number</label>
                                <input
                                    {...register('phone', { required: true })}
                                    type="text"
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${watch('phone') ? 'border-auralyellow' : 'border-gray-300'
                                        } focus:border-auralyellow`}
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-6 mx-auto px-16 py-2 font-montserrat font-semibold bg-auralyellow text-lg text-white rounded"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-white h-auto py-10 w-[600px] px-10 rounded-lg shadow-lg">
                            <div className="bg-green-500 text-white font-bold p-4 rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <p className="mt-4 text-xl text-black font-semibold font-poppins">Thank You! You will be contacted soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="bg-auralblue text-white py-10 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 1st Part: Company Info */}
                    <div className='col-span-1'>
                        <img src={assets.logowhite} alt="Company Logo" className="mb-4 font-poppins" />
                        <p>At Aural Hearing Care, we provide personalized hearing solutions using the latest technology, offering a wide range of hearing aids from top manufacturers to meet your unique needs.</p>

                        <div className="flex space-x-3 mt-6">
                            <FaFacebook className='text-2xl font-extrabold font-poppins hover:scale-[1.05] transition-all duration-300 ease-in-out cursor-pointer' />
                            <FaInstagram className='text-2xl font-extrabold font-poppins hover:scale-[1.05] transition-all duration-300 ease-in-out cursor-pointer' />
                            <FaWhatsapp className='text-2xl font-extrabold font-poppins hover:scale-[1.05] transition-all duration-300 ease-in-out cursor-pointer' />
                            <FaLinkedin className='text-2xl font-extrabold font-poppins hover:scale-[1.05] transition-all duration-300 ease-in-out cursor-pointer' />
                        </div>
                        <p className="mt-6 font-poppins">License Number: XYZ12345</p>
                    </div>

                    {/* 2nd Part: Links */}
                    <div className='col-span-1 flex flex-row items-start gap-10'>

                        <div className='flex flex-col'>

                            <h4 className="font-semibold text-xl font-outfit ">Links</h4>
                            <div className='w-36 rounded-md h-[2px] bg-white mb-2'></div>
                            <ul>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Home</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Products</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Services</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">About-Us</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Contact Us</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">My Account</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">My Orders</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Tracking</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Privacy Policy</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Terms and Conditions</a></li>
                                <li className="hover:text-gray-200"><a href="#" className="font-poppins text-sm cursor-pointer">Disclaimer</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-xl font-outfit w-max">Contact Us</h4>
                            <div className='w-36 rounded-md h-[2px] bg-white mb-2'></div>
                            <p className='font-poppins mb-2 hover:text-gray-200  cursor-pointer'>Phone: +91 98234 49422</p>
                            <p className='font-poppins mb-2 hover:text-gray-200  cursor-pointer'>Address: Shop no: 6, Pushpkunj Complex, beside YES BANK, near Hotel Centre Point, Ramdaspeth, Nagpur, Maharashtra 440010</p>
                            <p className='font-poppins mb-2 hover:text-gray-200 cursor-pointer whitespace-nowrap cursor-pointer'>Email: auralhearingcare@gmail.com</p>
                        </div>
                    </div>

                    {/* 3rd Part: Contact Info */}

                    {/* 4th Part: Embedded Map */}
                    <div className='col-span-2 md:pl-48'>
                        <h4 className="font-semibold text-lg ">Our Location</h4>
                        <div className='w-36 rounded-md h-[2px] bg-white mb-2'></div>
                        <div className="mapouter">
                            <div className="gmap_canvas">
                                <iframe
                                    width="100%"
                                    height="300"
                                    id="gmap_canvas"
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14885.789053306651!2d79.0758841!3d21.1345917!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c090266c94d7%3A0xb2ce5764bbf8e142!2sAural%20Hearing%20Care!5e0!3m2!1sen!2sin!4v1724783436675!5m2!1sen!2sin"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    title="Google Map"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                </div>
                </div>
                <div className='w-full font-poppins py-2 text-[16px] text-center text-white bg-auralyellow'>Copyright © 2024. Aural Hearing Care All rights reserved
            </div>
        </div>
    );
};

export default Footer;
