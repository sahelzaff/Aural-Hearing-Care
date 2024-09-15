import React from 'react'
import { SlCalender } from "react-icons/sl";
import { RxDividerVertical } from "react-icons/rx";
import { MdHearing } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import Link from 'next/link';


const TopbarBelow = () => {
    return (
        <div className='w-full h-auto py-3 px-10 bg-auralyellow Homepage'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row items-center'>

                    <div className='flex flex-row items-center justify-start gap-1 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out'>
                        <SlCalender className='text-3xl text-white font-extrabold' />
                        <span className='ml-2 text-white font-outfit text-xl font-medium'>Book an appointment</span>
                    </div>
                    <RxDividerVertical className='text-white text-3xl' />
                    <Link href='/online-hearing-test'>
                        <div className='flex flex-row items-center justify-start gap-1 cursor-pointer hover:scale-[1.05] transition-all duration-300 ease-in-out'>
                            <MdHearing className='text-3xl text-white font-extrabold' />
                            <span className='ml-2 text-white font-outfit text-xl font-medium'>Online Hearing Test</span>
                        </div>
                    </Link>

                </div>

                <div className='flex flex-row items-center'>
                    <div className='flex flex-row items-center justify-start '>
                        <IoMdMail className='text-2xl text-white font-extrabold' />
                        <span className='ml-2 text-white font-outfit text-xl font-medium'>auralhearingcare@gmail.com</span>
                    </div>
                    <RxDividerVertical className='text-white text-3xl' />
                    <div className='flex flex-row items-center justify-start '>
                        <FaPhoneAlt className='text-2xl text-white font-extrabold' />
                        <span className='ml-2 text-white font-outfit text-xl font-medium'>+91 98234 49422 </span>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default TopbarBelow