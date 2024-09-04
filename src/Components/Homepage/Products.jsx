import React from 'react'
import ProductSlider from './Product_Slider'

const Products = () => {
  return (
    <div className='w-full h-auto pb-10 px-4 sm:px-8 lg:px-16'>
        <div className='flex flex-col gap-8 md:gap-10'>
            <div className='flex flex-col items-start'>
                <h1 className='text-2xl sm:text-3xl font-outfit text-black'>
                    Products
                </h1>
                <h2 className='text-3xl sm:text-4xl md:text-5xl font-outfit text-auralyellow font-semibold'>
                    Explore Our Range Of Products
                </h2>
            </div>
            <div>
                <ProductSlider/>
            </div>
        </div>
    </div>
  )
}

export default Products
