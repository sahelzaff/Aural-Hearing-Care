import React from 'react'
import ProductCard from '../Products/ProductCard'

const products = [
    {
        id: 1,
        name: "Phonak Audéo Paradise P90",
        brand: "Phonak",
        description: "Premium hearing aid with exceptional sound quality and connectivity features.",
        price: 125000,
        rating: 5,
        reviews: 128,
        image: "/assets/product_1.avif",
        category: "Hearing Aids",
        features: [
            "AutoSense OS 4.0",
            "Universal Bluetooth connectivity",
            "Rechargeable",
            "Motion sensor hearing"
        ]
    },
    {
        id: 2,
        name: "Oticon More™ 1",
        brand: "Oticon",
        description: "AI-powered hearing aid for a more natural listening experience.",
        price: 135000,
        rating: 4,
        reviews: 96,
        image: "/assets/product_2.avif",
        category: "Hearing Aids",
        features: [
            "Deep Neural Network",
            "BrainHearing™ technology",
            "Tinnitus support",
            "Rechargeable option"
        ]
    },
    {
        id: 3,
        name: "ReSound ONE RIE 61",
        brand: "ReSound",
        description: "Revolutionary hearing aid with M&RIE receiver for natural sound.",
        price: 115000,
        rating: 5,
        reviews: 84,
        image: "/assets/product_3.avif",
        category: "Hearing Aids",
        features: [
            "All Access Directionality",
            "Ultra Focus",
            "Rechargeable",
            "Made for iPhone"
        ]
    },
    {
        id: 4,
        name: "Widex Moment™ 440",
        brand: "Widex",
        description: "Most natural-sounding hearing aids with PureSound™ technology.",
        price: 145000,
        rating: 4,
        reviews: 72,
        image: "/assets/product_4.avif",
        category: "Hearing Aids",
        features: [
            "PureSound™ technology",
            "SoundSense Learn",
            "Rechargeable",
            "TruAcoustics"
        ]
    }
];

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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className='flex justify-center'>
                    <button className='px-6 py-3 bg-auralblue text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium'>
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Products
