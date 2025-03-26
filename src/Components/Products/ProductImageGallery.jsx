'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ImageMagnifier = ({ 
  src, 
  alt, 
  width = "100%", 
  height = "500px",
  magnifierWidth = 200,  // Width of rectangle
  magnifierHeight = 150, // Height of rectangle
  zoomLevel = 1.5
}) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);
  
  // Reset image error state and magnifier position when src changes
  useEffect(() => {
    setImageError(false);
    setShowMagnifier(false);
    setXY([0, 0]);
    console.log("ImageMagnifier: Source changed to:", src);
    
    // Reset size if we have an image reference
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setSize([width, height]);
    }
  }, [src]);
  
  // Handle image error
  const handleImageError = (e) => {
    console.log("Image failed to load:", src);
    setImageError(true);
  };
  
  // Handle image load success
  const handleImageLoad = (e) => {
    console.log("Image loaded successfully:", src);
    const { width, height } = e.target.getBoundingClientRect();
    setSize([width, height]);
  };
  
  return (
    <div 
      style={{
        position: "relative",
        height: height,
        width: width
      }}
      className="flex items-center justify-center"
    >
      {imageError ? (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-poppins">Image Not Found</p>
        </div>
      ) : (
        <>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="w-full h-full object-contain"
            onError={handleImageError}
            onLoad={handleImageLoad}
            onMouseEnter={(e) => {
              const elem = e.currentTarget;
              const { width, height } = elem.getBoundingClientRect();
              setSize([width, height]);
              setShowMagnifier(true);
            }}
            onMouseMove={(e) => {
              const elem = e.currentTarget;
              const { top, left } = elem.getBoundingClientRect();
              
              const x = e.pageX - left - window.pageXOffset;
              const y = e.pageY - top - window.pageYOffset;
              setXY([x, y]);
            }}
            onMouseLeave={() => {
              setShowMagnifier(false);
            }}
          />

          {showMagnifier && (
            <div
              style={{
                position: "absolute",
                left: Math.max(
                  0,
                  Math.min(x - magnifierWidth / 2, imgWidth - magnifierWidth)
                ),
                top: Math.max(
                  0,
                  Math.min(y - magnifierHeight / 2, imgHeight - magnifierHeight)
                ),
                width: `${magnifierWidth}px`,
                height: `${magnifierHeight}px`,
                pointerEvents: "none",
                backgroundColor: "white",
                backgroundImage: `url('${src}')`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
                zIndex: 10,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const ProductImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbErrors, setThumbErrors] = useState({});
  const [validImages, setValidImages] = useState([]);

  // Process and validate images on component mount or when images prop changes
  useEffect(() => {
    // Log the received images for debugging
    console.log("ProductImageGallery received images:", images);
    
    // Filter out invalid images
    const filteredImages = images.filter((img, index) => {
      const isValid = img && img.url && (img.url.startsWith('http') || img.url.startsWith('/'));
      if (!isValid) {
        console.log(`Invalid image at index ${index}:`, img);
        // Add to thumbErrors to prevent rendering issues
        setThumbErrors(prev => ({...prev, [index]: true}));
      }
      return isValid;
    });
    
    console.log("Filtered valid images:", filteredImages);
    setValidImages(filteredImages);
    
    // Reset selected image to 0 when images change
    setSelectedImage(0);
  }, [images]);
  
  // Log when selected image changes
  useEffect(() => {
    console.log("Selected image index changed to:", selectedImage);
    console.log("Current image:", validImages[selectedImage]);
  }, [selectedImage, validImages]);

  // Handle no images case
  if (!validImages || validImages.length === 0) {
    console.log("No valid images to display");
    return (
      <div className="space-y-4">
        <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 font-poppins">No Product Images Available</p>
          </div>
        </div>
      </div>
    );
  }

  // Function to handle thumbnail click
  const handleThumbnailClick = (index) => {
    console.log(`Thumbnail clicked: ${index}, setting as selected image`);
    setSelectedImage(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Custom Magnifier */}
      <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
        <ImageMagnifier
          key={`main-image-${selectedImage}`} // Add key to force re-render when selected image changes
          src={validImages[selectedImage].url}
          alt={validImages[selectedImage].alt_text || 'Product Image'}
          width="100%"
          height="500px"
          magnifierWidth={250}
          magnifierHeight={200}
          zoomLevel={1.5}
        />
      </div>

      {/* Thumbnail Images - only show if we have more than 1 image */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {validImages.map((image, index) => (
            <motion.button
              key={`thumb-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={`relative rounded-lg overflow-hidden bg-gray-50 p-2 transition-all duration-200 ${
                selectedImage === index 
                  ? 'ring-2 ring-auralblue' 
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {thumbErrors[index] ? (
                <div className="flex items-center justify-center h-20 w-full">
                  <p className="text-xs text-gray-500">No Image</p>
                </div>
              ) : (
                <img
                  src={image.url}
                  alt={image.alt_text || 'Product Image'}
                  className="w-full h-20 object-contain"
                  onError={(e) => {
                    console.log(`Thumbnail image at index ${index} failed to load:`, image.url);
                    setThumbErrors(prev => ({...prev, [index]: true}));
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 