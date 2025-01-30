import React from 'react'
import { FaLocationArrow, FaPhoneAlt } from 'react-icons/fa'
import { MdOutlineAccessTime } from 'react-icons/md'

const Contact = () => {
  return (
    <div className='w-full h-full bg-auralyellow/80 py-16 '>
      <div className='px-16'>
        <div className='flex flex-col items-start'>
          <h1 className='text-5xl font-outfit text-white font-semibold'>Contact</h1>
          <p className='font-poppins text-[16px] text-gray-600 px-2'>Visit our clinic for personalized hearing solutions and care.</p>
        </div>
        <div className='flex flex-row items-start justify-between pt-10 px-4'>
          <div className='flex items-start gap-5 w-1/3'>
            <FaLocationArrow className='text-auralblue text-4xl flex-shrink-0' />
            <h1 className='font-poppins text-[16px] text-white'>Shop no: 6, Pushpkunj Complex, beside YES BANK, near Hotel Centre Point, Ramdaspeth, Nagpur, Maharashtra 440010</h1>
          </div>
          <div className='flex items-start gap-5 w-1/3 justify-center'>
            <FaPhoneAlt className='text-auralblue text-4xl flex-shrink-0' />
            <div className='font-poppins text-lg text-white'>
              <h1>Ph: 0712-2441100</h1>
              <h1>Mob: +91 98234 49422</h1>
            </div>
          </div>
          <div className='flex items-start gap-5 w-1/3 justify-center'>
            <MdOutlineAccessTime className='text-auralblue text-5xl flex-shrink-0' />
            <h1 className='font-poppins text-lg text-white'>Mon - Sat <br />10am - 7pm</h1>
          </div>
        </div>
        <div className="mapouter py-10 rounded-lg">
          <div className="gmap_canvas">
            <iframe
              width="100%"
              height="500"
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
  )
}

export default Contact