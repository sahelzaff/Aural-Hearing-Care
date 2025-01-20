'use client'
import React, { useState, useEffect, useRef } from 'react';
import '../Components.css';
import assets from '../../../public/assets/assets';

const FirstVisit = () => {
    const visitDetails = [
        {
            title: 'Case History',
            description: 'We will ask you detailed questions regarding your hearing health history and current lifestyle in order to properly understand your concerns and needs.',
            image: assets.health_report,
        },
        {
            title: 'Otoscopy Examination',
            description: 'A visual inspection of your ear canal and eardrum will help us identify any physical contributors to hearing loss.',
            image: assets.physical_examination,
        },
        {
            title: 'Hearing Test',
            description: 'You&apos;ll undergo a hearing test to measure how you perceive different tones and speech sounds, helping us pinpoint the nature and cause of any hearing loss.',
            image: assets.audiometer,
        },
        {
            title: 'Treatment Recommendations',
            description: 'Based on your results, we&apos;ll discuss personalized treatment options that cater to your hearing sensitivity and daily life.',
            image: assets.first_aid_kit,
        },
        {
            title: 'Hearing Health Education',
            description: 'We will explore various hearing aid options, focusing on technology that suits your sound environments, lifestyle, and budget.',
            image: assets.auditory,
        },
        {
            title: 'Hearing Aid Consultation',
            description: 'We&apos;ll provide you with information on protecting your hearing and maintaining your hearing aids for optimal performance.',
            image: assets.hearing_aid,
        },
        {
            title: 'Follow-Up Plan',
            description: 'We&apos;ll establish a follow-up schedule to ensure your treatment and hearing aids are working optimally for you.',
            image: assets.schedule,
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRefs = useRef([]);

    useEffect(() => {
        const currentRefs = sectionRefs.current;
    
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.5
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = currentRefs.indexOf(entry.target);
                    if (index !== -1) {
                        setCurrentIndex(index);
                    }
                }
            });
        }, options);
    
        currentRefs.forEach((section) => {
            if (section) {
                observer.observe(section);
            }
        });
    
        return () => {
            currentRefs.forEach((section) => {
                if (section) {
                    observer.unobserve(section);
                }
            });
        };
    }, []);
    

    return (
        <div className="w-full bg-gradient-to-b  py-20">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-auralyellow text-3xl sm:text-5xl font-bold font-outfit mb-4">
                        What to expect during your first Visit
                    </h1>
                    <p className="font-poppins text-base text-gray-600 max-w-2xl mx-auto">
                        When you schedule your first appointment, we will conduct a detailed assessment, which includes:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="flex flex-col space-y-4">
                        <div
                            ref={(el) => sectionRefs.current[0] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                0 === currentIndex 
                                    ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={visitDetails[0].image}
                                alt={visitDetails[0].title}
                                className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    0 === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[0].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[0].description}</p>
                            </div>
                        </div>

                        <div
                            ref={(el) => sectionRefs.current[2] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                2 === currentIndex 
                                    ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={visitDetails[2].image}
                                alt={visitDetails[2].title}
                                className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    2 === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[2].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[2].description}</p>
                            </div>
                        </div>

                        <div
                            ref={(el) => sectionRefs.current[4] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                4 === currentIndex 
                                    ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={visitDetails[4].image}
                                alt={visitDetails[4].title}
                                className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    4 === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[4].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[4].description}</p>
                            </div>
                        </div>

                        <div
                            ref={(el) => sectionRefs.current[6] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                6 === currentIndex 
                                    ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={visitDetails[6].image}
                                alt={visitDetails[6].title}
                                className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    6 === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[6].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[6].description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col space-y-4 md:mt-[92px]">
                        <div
                            ref={(el) => sectionRefs.current[1] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                1 === currentIndex 
                                            ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <img
                                src={visitDetails[1].image}
                                alt={visitDetails[1].title}
                                        className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    1 === currentIndex ? 'filter-none' : 'grayscale'
                                        }`}
                                    />
                                    <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[1].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[1].description}</p>
                                    </div>
                                </div>

                        <div
                            ref={(el) => sectionRefs.current[3] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                3 === currentIndex 
                                    ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <img
                                src={visitDetails[3].image}
                                alt={visitDetails[3].title}
                                className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    3 === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[3].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[3].description}</p>
                            </div>
                    </div>

                        <div
                            ref={(el) => sectionRefs.current[5] = el}
                            className={`flex items-start p-6 rounded-xl transition-all duration-500 ease-in-out h-[180px] ${
                                5 === currentIndex 
                                            ? 'bg-auralblue text-white scale-[1.02] shadow-lg' 
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <img
                                src={visitDetails[5].image}
                                alt={visitDetails[5].title}
                                        className={`w-12 h-12 mr-4 transition-all duration-500 ease-in-out ${
                                    5 === currentIndex ? 'filter-none' : 'grayscale'
                                        }`}
                                    />
                                    <div>
                                <h2 className="text-lg font-bold mb-2 font-outfit">{visitDetails[5].title}</h2>
                                <p className="text-sm font-poppins leading-relaxed">{visitDetails[5].description}</p>
                                    </div>
                                </div>
                    </div>
                </div>

                <div className="pt-12 flex justify-center">
                    <button type="button" className='font-medium flex flex-row gap-2 items-center text-white py-3 px-6 rounded-lg bg-auralyellow hover:scale-105 transition-all duration-300 ease-in-out'>
                        <img src={assets.books} className='w-6' alt="" />
                        <span className='font-montserrat font-semibold'>Hearing Resource</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FirstVisit;