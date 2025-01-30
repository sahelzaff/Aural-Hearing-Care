'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useLenis from '@/app/Hooks/uselenis';
import { FaFacebook, FaWhatsapp, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import assets from '../../../public/assets/assets';

const Footer = () => {
    useLenis();
    const { register, handleSubmit, watch, formState: { isSubmitted } } = useForm();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        setFormSubmitted(true);
    };

    return (
        <footer className="w-full">
            {/* Request Callback Section */}
            <div
                className="relative h-auto py-20 overflow-hidden bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url(${assets.request_callback})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 flex items-center justify-center h-full w-full">
                    {!formSubmitted ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-white text-black py-10 w-[600px] px-10 rounded-lg shadow-lg">
                            <h2 className="text-4xl font-semibold font-outfit text-center text-auralyellow mb-6">Request a Call Back</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium font-poppins">Name</label>
                                    <input
                                        {...register('name', { required: true })}
                                        type="text"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-auralyellow"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium font-poppins">Email</label>
                                    <input
                                        {...register('email', { required: true })}
                                        type="email"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-auralyellow"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium font-poppins">Phone Number</label>
                                    <input
                                        {...register('phone', { required: true })}
                                        type="tel"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-auralyellow"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-6 w-full py-2 font-montserrat font-semibold bg-auralyellow text-white rounded transition-colors hover:bg-opacity-90"
                            >
                                Submit
                            </button>
                        </form>
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="bg-green-500 text-white rounded-full p-4 w-16 h-16 mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-xl font-poppins font-semibold">Thank You! We'll contact you soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Footer Section */}
            <div className="bg-auralblue text-white">
                <div className=" mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div>
                            <img src={assets.logowhite} alt="Aural Hearing Care" className="h-20 mb-6" />
                            <p className="font-poppins text-sm mb-6">
                                At Aural Hearing Care, we provide personalized hearing solutions using the latest technology, 
                                offering a wide range of hearing aids from top manufacturers to meet your unique needs.
                            </p>
                            <div className="flex space-x-4 mb-6">
                                <FaFacebook className="text-2xl hover:text-auralyellow cursor-pointer transition-colors" />
                                <FaInstagram className="text-2xl hover:text-auralyellow cursor-pointer transition-colors" />
                                <FaWhatsapp className="text-2xl hover:text-auralyellow cursor-pointer transition-colors" />
                                <FaLinkedin className="text-2xl hover:text-auralyellow cursor-pointer transition-colors" />
                            </div>
                            {/* <p className="font-poppins text-sm">License Number: XYZ12345</p> */}
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-outfit text-xl font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {['Home', 'Products', 'Services', 'About Us', 'Contact', 'Blogs'].map((link) => (
                                    <li key={link}>
                                        <a href={link === 'Blogs' ? '/blog' : '#'} className="font-poppins text-sm hover:text-auralyellow transition-colors">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-outfit text-xl font-semibold mb-4">Contact Us</h4>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <FaPhoneAlt className="mt-1 text-lg" />
                                    <p className="font-poppins text-sm">+91 98234 49422</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FaEnvelope className="mt-1 text-lg" />
                                    <p className="font-poppins text-sm">auralhearingcare@gmail.com</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <FaMapMarkerAlt className="mt-1 text-xl flex-shrink-0" />
                                    <p className="font-poppins text-sm">
                                        Shop no: 6, Pushpkunj Complex, beside YES BANK, 
                                        near Hotel Centre Point, Ramdaspeth, 
                                        Nagpur, Maharashtra 440010
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div>
                            <h4 className="font-outfit text-xl font-semibold mb-4">Our Location</h4>
                            <div className="rounded-lg overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14885.789053306651!2d79.0758841!3d21.1345917!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c090266c94d7%3A0xb2ce5764bbf8e142!2sAural%20Hearing%20Care!5e0!3m2!1sen!2sin!4v1724783436675!5m2!1sen!2sin"
                                    width="100%"
                                    height="250"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="bg-auralyellow py-3">
                    <p className="text-center font-poppins text-sm">
                        Copyright © {new Date().getFullYear()} Aural Hearing Care. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
