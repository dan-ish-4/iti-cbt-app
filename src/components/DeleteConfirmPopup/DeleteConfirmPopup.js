import React, { useState } from 'react';
import './DeleteConfirmPopup.css';
import Popup from '../Popup/Popup';

const DeleteConfirmPopup = ({ isOpen, onClose }) => {
  // 'confirm' or 'otp'
  const [step, setStep] = useState('confirm');

  // Reset to the first step when the popup is closed
  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleConfirmDelete = () => {
    // In a real app, this would trigger an API call to send the OTP
    console.log("Sending OTP...");
    setStep('otp');
  };

  return (
    <Popup isOpen={isOpen} onClose={handleClose}>
      <div className='delete-confirm-content'>
        <h3>Delete Account?</h3>

        {step === 'confirm' && (
          <div id='deleteStep1'>
            <p>
              If you delete your account, all your coins and data will be permanently removed.
              <br /><b>Are you sure you want to delete your account?</b>
            </p>
            <div className='delete-actions'>
              <button className='action-btn' onClick={handleClose}>Cancel</button>
              <button className='action-btn danger' onClick={handleConfirmDelete}>Yes, Delete</button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div id='deleteStep2'>
            <label htmlFor='otpInput'>Enter OTP sent to your registered email:</label>
            <input id='otpInput' placeholder='Enter OTP' type='text' />
            <button className='action-btn danger'>Confirm Delete</button>
          </div>
        )}
      </div>
    </Popup>
  );
};

export default DeleteConfirmPopup;