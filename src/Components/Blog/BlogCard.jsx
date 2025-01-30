'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaRegClock, FaEye } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
  // Function to format date consistently
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <Link href={`/blog/${blog.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.mainImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-auralblue text-white px-3 py-1 rounded-full text-sm font-poppins">
              {blog.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 font-outfit">{blog.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2 font-poppins">{blog.excerpt}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaRegClock className="mr-1" />
                {blog.readTime}
              </span>
              <span className="flex items-center">
                <FaEye className="mr-1" />
                {blog.views.toLocaleString()}
              </span>
            </div>
            <span>{formatDate(blog.publishDate)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard; 