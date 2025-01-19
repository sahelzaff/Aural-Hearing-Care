const ProductReviews = {
  "1": [
    {
      id: 1,
      user: "John Smith",
      rating: 5,
      date: "2024-03-15",
      title: "Excellent hearing aid with great features",
      review: "I've been using this hearing aid for 3 months now and I'm extremely satisfied. The sound quality is exceptional and the Bluetooth connectivity works flawlessly with my phone.",
      verified_purchase: true,
      helpful_count: 24,
      images: [
        "/assets/product_1.avif",
        "/assets/product_2.avif"
      ]
    },
    {
      id: 2,
      user: "Sarah Johnson",
      rating: 4,
      date: "2024-03-10",
      title: "Good but battery life could be better",
      review: "The hearing aid performs well in most situations. Sound clarity is great and it's comfortable to wear. However, I find myself charging it more often than expected.",
      verified_purchase: true,
      helpful_count: 15
    },
    {
      id: 3,
      user: "Michael Brown",
      rating: 5,
      date: "2024-03-05",
      title: "Life-changing device",
      review: "This hearing aid has made a huge difference in my daily life. The noise cancellation feature is particularly impressive in crowded environments.",
      verified_purchase: true,
      helpful_count: 32
    }
  ],
  "2": [
    {
      id: 1,
      user: "Emily Davis",
      rating: 5,
      date: "2024-03-12",
      title: "Perfect fit and great sound quality",
      review: "The in-ear design is very comfortable and practically invisible. Sound quality is crystal clear and the app makes it easy to adjust settings.",
      verified_purchase: true,
      helpful_count: 18
    },
    {
      id: 2,
      user: "Robert Wilson",
      rating: 4,
      date: "2024-03-08",
      title: "Great product with minor drawbacks",
      review: "The sound processing is excellent and it works great in most situations. The only minor issue is that the app occasionally needs to be restarted.",
      verified_purchase: true,
      helpful_count: 12
    }
  ]
};

export const getProductReviews = (productId) => {
  return ProductReviews[productId] || [];
};

export const getAverageRating = (productId) => {
  const reviews = ProductReviews[productId] || [];
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1);
};

export const getRatingDistribution = (productId) => {
  const reviews = ProductReviews[productId] || [];
  const distribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  reviews.forEach(review => {
    distribution[review.rating]++;
  });

  return distribution;
};

export default ProductReviews; 