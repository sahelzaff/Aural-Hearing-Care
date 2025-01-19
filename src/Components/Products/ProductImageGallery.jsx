'use client';
import { useState, useRef } from 'react';
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
  
  return (
    <div 
      style={{
        position: "relative",
        height: height,
        width: width
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
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
    </div>
  );
};

const ProductImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image with Custom Magnifier */}
      <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
        <ImageMagnifier
          src={images[selectedImage].url}
          alt={images[selectedImage].alt_text}
          width="100%"
          height="500px"
          magnifierWidth={250}
          magnifierHeight={200}
          zoomLevel={1.5}
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative rounded-lg overflow-hidden bg-gray-50 p-2 transition-all duration-200 ${
              selectedImage === index 
                ? 'ring-2 ring-auralblue' 
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={image.url}
              alt={image.alt_text}
              className="w-full h-20 object-contain"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery; 