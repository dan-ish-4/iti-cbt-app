import React from 'react';
import './OrientationPopup.css';

const OrientationPopup = ({ isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className='orientation-popup-overlay'>
      <div className='phone-animation'>
        <div className='phone-screen' />
      </div>
    </div>
  );
};

export default OrientationPopup;