import React from 'react';
import VisitCard from './VisitCard';
import { FaPhoneAlt } from "react-icons/fa";
import assets from '../../../public/assets/assets';

const First_visit = () => {
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

    return (
        <div className="w-full max-w-screen-2xl h-full px-16 py-20">
            <div>
                <h1 className="text-auralyellow text-6xl font-bold font-outfit text-center w-full">
                    What to expect during your first Visit
                </h1>
                <p className="font-poppins text-lg text-center text-gray-500 pt-1">
                    When you schedule your first appointment, we will conduct a detailed assessment, which includes
                </p>
            </div>

            {visitDetails.map((detail, index) => (
                <VisitCard
                    key={index}
                    title={detail.title}
                    description={detail.description}
                    image={detail.image}
                    alignment={index % 2 === 0 ? 'left' : 'right'}
                />
            ))}

            <div className=' pt-10 flex flex-row items-center justify-center'>

                <button type="button" className=' font-medium flex flex-row gap-2 items-center text-white py-3 px-3 rounded-lg bg-auralyellow hover:scale-105 transition-all duration-300 ease-in-out text-3xl '> <img src={assets.books} className='w-10' alt="" srcset="" /> <span className='text-xl font-montserrat font-semibold'>Hearing Resource</span></button>

            </div>
        </div>
    );
};

export default First_visit;
