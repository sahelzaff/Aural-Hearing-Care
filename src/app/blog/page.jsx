'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import BlogCard from '@/Components/Blog/BlogCard';
import { blogs, categories } from '@/data/blogs';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = selectedCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  return (
    <>
      <TopbarBelow />
      <ClientNavbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] bg-gray-900 flex items-center justify-center text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-auralblue to-auralyellow opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 font-outfit"
          >
            Our Blog
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-200 font-poppins"
          >
            Stay updated with the latest in hearing healthcare
          </motion.p>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-auralblue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-auralblue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage; 