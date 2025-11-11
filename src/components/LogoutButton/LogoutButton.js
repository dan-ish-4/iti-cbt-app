import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import Spinner from '../Spinner/Spinner';
import { auth } from '../../firebase'; // Import the pre-initialized auth instance
import { backendFetch } from '../../utils/backendFetch';

const LogoutButton = ({ onLogoutSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const sessionId = localStorage.getItem('sessionId');

    // Optional: Notify backend to invalidate session
    if (sessionId) {
      try {
        await backendFetch('https://admin.online2study.in/logout.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
      } catch (err) {
        console.error('Backend logout error:', err);
        // Continue logout even if backend fails
      }
    }

    try {
      await signOut(auth);
      // Clear all relevant localStorage items
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userId');
      localStorage.removeItem('userProfileCompleted');
      localStorage.removeItem('firebaseUid');
      localStorage.removeItem('userName');
      localStorage.removeItem('userMobile');
      localStorage.removeItem('userLang');
      localStorage.removeItem('userTrade');

      // Notify parent or trigger redirect
      if (onLogoutSuccess) onLogoutSuccess();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('Error logging out: ' + error.message);
    }
  };

  return (
    <>
      <li id="logoutBtn" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <i className="fas fa-sign-out-alt"></i> Log out
      </li>
      <Spinner isLoading={isLoading} />
    </>
  );
};

export default LogoutButton;
