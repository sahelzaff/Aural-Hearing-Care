'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import TopbarBelow from '@/Components/Global Components/TopbarBelow';
import ClientNavbar from '@/Components/Global Components/ClientNavbar';
import Footer from '@/Components/Global Components/Footer';
import BlogSidebar from '@/Components/Blog/BlogSidebar';
import { getBlogBySlug, getRelatedBlogs, getMostViewedBlogs, categories } from '@/data/blogs';
import Link from 'next/link';

const BlogPost = () => {
  const { slug } = useParams();
  const blog = getBlogBySlug(slug);
  const relatedPosts = getRelatedBlogs(blog.id);
  const mostViewedPosts = getMostViewedBlogs();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  if (!blog) return null;

  return (
    <>
      {/* <TopbarBelow />
      <ClientNavbar /> */}
      
      <div className="bg-gray-50 ">
        <div className="max-w-7xl mx-auto ">
           {/* Breadcrumbs */}
           <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center space-x-2 text-sm font-poppins">
                    <Link href="/" className="text-gray-600 hover:text-auralblue transition-colors">Home</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link href="/blog" className="text-gray-600 hover:text-auralblue transition-colors">Blog</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-auralblue font-medium max-w-[200px] whitespace-nowrap">{blog.title}</span>
                  </div>
                </div>
              </nav>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
             
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                {/* Author Info */}
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-4">
                    <img
                      src={blog.author.image}
                      alt={blog.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-outfit font-semibold">{blog.author.name}</h3>
                      <p className="text-gray-500 text-sm font-poppins">{blog.author.role}</p>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-8">
                  <h1 className="text-3xl font-bold mb-6 font-outfit">{blog.title}</h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-poppins"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Main Image */}
                  <div className="mb-8">
                    <img
                      src={blog.mainImage}
                      alt={blog.title}
                      className="w-full h-[400px] object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div 
                    className="prose max-w-none font-poppins"
                    dangerouslySetInnerHTML={{ 
                      __html: blog.content.replace(
                        /<h2>/g, 
                        '<h2 class="text-2xl font-bold mt-8 mb-4 font-outfit">'
                      ).replace(
                        /<h3>/g,
                        '<h3 class="text-xl font-semibold mt-6 mb-3 font-outfit">'
                      ).replace(
                        /<p>/g,
                        '<p class="mb-4 text-gray-700 leading-relaxed">'
                      ).replace(
                        /<ul>/g,
                        '<ul class="list-disc pl-6 mb-4 space-y-2">'
                      ).replace(
                        /<li>/g,
                        '<li class="text-gray-700">'
                      )
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <BlogSidebar
                categories={categories}
                mostViewedPosts={mostViewedPosts}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default BlogPost; 