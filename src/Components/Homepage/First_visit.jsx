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
        const currentRefs = sectionRefs.current;  // Capture the current ref values
    
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.25,
        };
    
        const observer = new IntersectionObserver((entries) => {
            let newIndex = currentIndex;
    
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = currentRefs.indexOf(entry.target);
                    if (index !== -1) {
                        newIndex = index;
                    }
                }
            });
    
            setCurrentIndex(newIndex);
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
    }, [currentIndex]);
    

    return (
        <div className="w-3/4 mx-auto px-4 sm:px-8 py-16 bg-gray-100 rounded-lg shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-auralyellow text-3xl sm:text-5xl font-bold font-outfit">
                    What to expect during your first Visit
                </h1>
                <p className="font-poppins text-base text-gray-500 pt-2">
                    When you schedule your first appointment, we will conduct a detailed assessment, which includes:
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 bg-[#f4f4f4] p-8 rounded-lg shadow-md">
                <div className="flex flex-col space-y-6 w-full">
                    {visitDetails.map((detail, index) => (
                        <div
                            key={index}
                            ref={(el) => sectionRefs.current[index] = el}
                            className={`flex items-center p-4 rounded-lg transition-all duration-700 ease-in-out ${
                                index === currentIndex ? 'bg-auralblue text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            <img
                                src={detail.image}
                                alt={detail.title}
                                className={`transition-all duration-700 ease-in-out ${
                                    index === currentIndex ? 'filter-none' : 'grayscale'
                                }`}
                                style={{ width: '60px', marginRight: '16px' }}
                            />
                            <div>
                                <h2 className="text-lg font-bold mb-2">{detail.title}</h2>
                                <p className="text-sm">{detail.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-10 flex justify-center">
                <button type="button" className='font-medium flex flex-row gap-2 items-center text-white py-3 px-4 rounded-lg bg-auralyellow hover:scale-105 transition-all duration-300 ease-in-out text-xl'>
                    <img src={assets.books} className='w-6' alt="" />
                    <span className='font-montserrat font-semibold'>Hearing Resource</span>
                </button>
            </div>
        </div>
    );
};

export default FirstVisit;