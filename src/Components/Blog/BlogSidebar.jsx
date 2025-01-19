const BlogSidebar = ({ categories, mostViewedPosts }) => {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-4 font-outfit">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 font-poppins"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Most Viewed Posts */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold mb-4 font-outfit">Most Viewed</h3>
        <div className="space-y-4">
          {mostViewedPosts.map((post) => (
            <div key={post.id} className="flex space-x-4">
              <img
                src={post.mainImage}
                alt={post.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-medium mb-1 font-outfit">{post.title}</h4>
                <p className="text-sm text-gray-500 font-poppins">
                  {post.views.toLocaleString()} views
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar; 