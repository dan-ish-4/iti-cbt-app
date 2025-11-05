import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import Spinner from '../Spinner/Spinner'; // Import Spinner for loading state

const LoginPopup = () => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      // The context's onAuthStateChanged will handle the UI switch
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError("Failed to sign in. Please try again.");
      }
      setLoading(false);
    }
  };

  // Since this component is now the entire screen for unauth users,
  // it doesn't need the <Popup> wrapper. It's a standalone view.
  return (
    <div className='login-container'>
      <Spinner isLoading={loading} />
      <div className='login-box'>
        <h2>Welcome to Ncvt Online</h2>
        <div className='login-icon'>
          <i className='fas fa-user-circle' />
          <p>Log in</p>
        </div>
        {error && <p className="login-error">{error}</p>}
        <div className='phone-login'>
          <div className='phone-input'>
            <i className='fas fa-flag' />
            <span>+91</span>
            <input id='mobileInput' maxLength='10' placeholder='Enter Mobile Number' type='text' />
          </div>
          <button className='continue-btn'>Continue</button>
        </div>
        <div className='separator'>
          <span>OR</span>
        </div>
        <div className='social-login'>
          <button className='social-btn google' onClick={handleGoogleSignIn} disabled={loading}>
            <i className='fab fa-google' /> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;