'use client'
import React, { useState, useEffect } from 'react';
import '../Components.css'
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
            description: 'You’ll undergo a hearing test to measure how you perceive different tones and speech sounds, helping us pinpoint the nature and cause of any hearing loss.',
            image: assets.audiometer,
        },
        {
            title: 'Treatment Recommendations',
            description: 'Based on your results, we’ll discuss personalized treatment options that cater to your hearing sensitivity and daily life.',
            image: assets.first_aid_kit,
        },
        {
            title: 'Hearing Health Education',
            description: 'We will explore various hearing aid options, focusing on technology that suits your sound environments, lifestyle, and budget.',
            image: assets.auditory,
        },
        {
            title: 'Hearing Aid Consultation',
            description: 'We’ll provide you with information on protecting your hearing and maintaining your hearing aids for optimal performance.',
            image: assets.hearing_aid,
        },
        {
            title: 'Follow-Up Plan',
            description: 'We’ll establish a follow-up schedule to ensure your treatment and hearing aids are working optimally for you.',
            image: assets.schedule,
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % visitDetails.length);
        }, 3000); 

        return () => clearInterval(interval);
    }, [visitDetails.length]);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="w-full max-w-screen-2xl h-full px-16 py-20">
            <div className="text-center">
                <h1 className="text-auralyellow text-6xl font-bold font-outfit text-center w-full">
                    What to expect during your first Visit
                </h1>
                <p className="font-poppins text-lg text-center text-gray-500 pt-1">
                    When you schedule your first appointment, we will conduct a detailed assessment, which includes
                </p>
            </div>

            <div className="relative flex flex-row h-[200px] mt-10 rounded-xl bg-auralblue">
                {/* Left Side - Icons */}
                <div className="w-1/3 flex flex-col items-center justify-center relative overflow-hidden">
                    {visitDetails.map((detail, index) => (
                        <img
                            key={index}
                            src={detail.image}
                            alt={detail.title}
                            className={`absolute transition-transform  duration-1000 ease-in-out ${
                                index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                            }`}
                            style={{ width: '120px' }}
                        />
                    ))}
                </div>

                {/* Right Side - Text */}
                <div className="w-full flex flex-col justify-center">
                    {visitDetails.map((detail, index) => (
                        <div
                            key={index}
                            className={`transition-opacity duration-1000 ease-in-out ${
                                index === currentIndex ? 'opacity-100' : 'opacity-0'
                            } absolute`}
                        >
                            <h2 className="text-4xl font-bold text-auralyellow font-outfit mb-2">{detail.title}</h2>
                            <p className="text-lg font-poppins text-white">{detail.description}</p>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row space-x-1 absolute top-4 left-4'>
                    <div className='bg-white w-4 h-4 rounded-full'></div>
                    <div className='bg-white w-4 h-4 rounded-full'></div>
                    <div className='bg-white w-4 h-4 rounded-full'></div>
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center mt-8">
                {visitDetails.map((_, index) => (
                    <div
                        key={index}
                        className={`w-4 h-4 mx-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center ${
                            index === currentIndex
                                ? 'bg-auralyellow border-2 border-white'
                                : 'bg-transparent border-2 border-gray-400'
                        }`}
                        onClick={() => handleDotClick(index)}
                    >
                        {index === currentIndex && (
                            <div className="w-2 h-2 rounded-full bg-auralyellow"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className='pt-10 flex flex-row items-center justify-center'>
                <button type="button" className='font-medium flex flex-row gap-2 items-center text-white py-3 px-3 rounded-lg bg-auralyellow hover:scale-105 transition-all duration-300 ease-in-out text-3xl'>
                    <img src={assets.books} className='w-10' alt="" /> 
                    <span className='text-xl font-montserrat font-semibold'>Hearing Resource</span>
                </button>
            </div>
        </div>
    );
};

export default FirstVisit;
