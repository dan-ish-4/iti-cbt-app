import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ message, onClose }) => {
  if (!message) {
    return null;
  }

  return (
    <div className='custom-alert-container'>
      <div className='custom-alert-box'>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default CustomAlert;