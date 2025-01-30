import React from 'react';
import assets from '../../../public/assets/assets';
import '../Components.css'


const Welcome = () => {
    return (
        <div className="relative h-max flex  justify-center text-center overflow-hidden py-10 mt-10">

            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${assets.abstract_bg})`, opacity: 0.5 }}
            ></div>


            <div className="relative z-10 welcome">
                <h2 className='text-6xl font-outfit text-auralyellow text-center font-bold'>Welcome to Aural Hearing Care</h2>
                <p className='text-lg font-poppins text-gray-400 text-center pt-1 '>Learn how our team provides personalized support to meet your hearing needs.</p>

                <div className='w-full pt-16'>
                    <div className=' grid grid-cols-3 gap-10 py-10'>
                        <div className='bg-white flex flex-col items-center justify-center border-[6px] border-auralblue h-[400px] hover:h-[500px] w-[400px] py-10 px-6  rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out'>
                            <img src={assets.hearing_testing} className='w-16 pb-5' alt="" />
                            <h1 className='font-outfit font-bold text-2xl text-auralyellow pb-2'>Hearing Testing</h1>
                            <p className='font-poppins text-[16px] pb-10'>With our expert audiologists, receive a complete hearing assessment to accurately gauge your hearing condition.</p>

                            <button>
                                <span className='font-montserrat text-white text-lg'>Learn More</span>
                                <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"></circle>
                                    <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="white"></path>
                                </svg>
                            </button>


                        </div>
                        <div className='bg-white flex flex-col items-center justify-center border-[6px] border-auralblue h-[400px] hover:h-[500px]  w-[400px] py-10 px-6  rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out'>
                            <img src={assets.hearing_care} className='w-16 pb-5' alt="" />
                            <h1 className='font-outfit font-bold text-2xl text-auralyellow pb-2'>Hearing Care Tailored Solutions</h1>
                            <p className='font-poppins text-[16px] pb-10'>Our selection includes hearing aids from the industry&apos;s top-rated manufacturers in the hearing technology field.</p>

                            <button>
                                <span className='font-montserrat text-white text-lg'>Learn More</span>
                                <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"></circle>
                                    <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="white"></path>
                                </svg>
                            </button>


                        </div>
                        <div className='bg-white flex flex-col items-center justify-center border-[6px] border-auralblue h-[400px] hover:h-[500px]  w-[400px] py-10 px-6  rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out'>
                            <img src={assets.Professional} className='w-16 pb-5' alt="" />
                            <h1 className='font-outfit font-bold text-2xl text-auralyellow pb-2'>Experience Professional</h1>
                            <p className='font-poppins text-[16px] pb-10'>Specializing in long-standing hearing loss, we offer personalized, affordable solutions tailored to your unique needs.</p>

                            <button>
                                <span className='font-montserrat text-white text-lg'>Learn More</span>
                                <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="37" cy="37" r="35.5" stroke="white" stroke-width="3"></circle>
                                    <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="white"></path>
                                </svg>
                            </button>


                        </div>
                        {/* <div className='bg-white'>
                    <img src={assets.hearing_care}className='w-28' alt="" />
                        <h1>Hearing Care Tailored Solutions</h1>
                        <p>With our expert audiologists, receive a complete hearing assessment to accurately gauge your hearing condition.</p>
                </div>
                <div className='bg-white'>
                    <img src={assets.Professional}className='w-28' alt="" />
                        <h1>Experience Professional</h1>
                        <p>Specialized in the evaluation and management of long standing hearing loss, Love to provide personalized, affordable solutions that suit your special requirements.</p>
                </div> */}


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
