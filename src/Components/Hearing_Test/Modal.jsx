import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // If the modal isn't open, return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          &times; {/* Close icon */}
        </button>
        {children} {/* Render the content passed to the modal */}
      </div>
    </div>
  );
};

export default Modal;
