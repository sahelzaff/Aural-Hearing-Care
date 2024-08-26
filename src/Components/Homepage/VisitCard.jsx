import React from 'react';

const VisitCard = ({ title, description, image, alignment }) => {
  const isLeftAligned = alignment === 'left';

  return (
    <div className={`flex flex-col items-${isLeftAligned ? 'start' : 'end'} w-full justify-center py-5`}>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-auralblue border border-gray-300 rounded-lg shadow-lg max-w-5xl mx-auto p-6 relative">
          <div className={`absolute top-4 ${isLeftAligned ? 'left-4' : 'right-4'} flex space-x-2`}>
            <div className="w-3 h-3 bg-[#f4f4f4] rounded-full"></div>
            <div className="w-3 h-3 bg-[#f4f4f4] rounded-full"></div>
            <div className="w-3 h-3 bg-[#f4f4f4] rounded-full"></div>
          </div>

          <div className={`flex items-start mt-8 ${isLeftAligned ? '' : 'flex-row-reverse'}`}>
            <img src={image} alt="Note Image" className="w-24 h-24 object-cover rounded-lg mr-6" />
            <div>
              <h2 className="text-3xl font-semibold mb-2 text-white font-outfit">{title}</h2>
              <p className="text-white font-poppins">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitCard;
