import React from 'react';
import './Popup.css';

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-container">
        <div className="popup-content">
          <button className="close-btn" onClick={onClose}>&#10006;</button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Popup;