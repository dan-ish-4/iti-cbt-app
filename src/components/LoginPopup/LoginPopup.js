import React from 'react';
import './LoginPopup.css';
import Popup from '../Popup/Popup'; // Import the wrapper

const LoginPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='login-box'>
        <h2>Welcome to Ncvt Online</h2>
        <div className='login-icon'>
          <i className='fas fa-user-circle' style={{ fontSize: '50px', color: '#1976d2' }} />
          <p>Log in</p>
        </div>
        <div className='phone-login'>
          <div className='phone-input'>
            <i className='fas fa-flag' style={{ color: '#ff9800' }} />
            <span style={{ width: '35px' }}>+91</span>
            <input id='mobileInput' maxLength='10' placeholder='Enter Mobile Number' type='text' />
          </div>
          <button className='continue-btn'>Continue</button>
        </div>
        <div className='separator'>
          <span>OR</span>
        </div>
        <div className='social-login'>
          <button className='social-btn google' id='googleSignIn'>
            <i className='fab fa-google' /> Continue with Google
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default LoginPopup;