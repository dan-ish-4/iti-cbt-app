import React from 'react';
import './ViewProfilePopup.css';
import Popup from '../Popup/Popup';
import { useUserProfile } from '../../hooks/useUserProfile'; // Import the new hook

const ViewProfilePopup = ({ isOpen, onClose, onEditClick }) => {
  // Use the hook to get all profile data and the loading state
  const { profile, imageUrl, languageName, categoryName, loading, error } = useUserProfile();

  const renderContent = () => {
    if (loading) {
      return <p>Loading Profile...</p>;
    }
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (!profile) {
      return <p>No profile data found.</p>;
    }

    return (
      <>
        <div className='profile-header'>
          <div className='profile-avatar' style={{ backgroundImage: `url(${imageUrl})` }} />
          <p className='profile-email'>{profile.email || 'No Email'}</p>
        </div>
        <div className='profile-body'>
          <h3 className='profile-greeting'>Hi, {profile.name || 'User'}!</h3>
          <p><b>Phone:</b> <span>{profile.phone_number || '-'}</span></p>
          <p><b>Language:</b> <span>{languageName}</span></p>
          <p><b>Category:</b> <span>{categoryName}</span></p>
        </div>
      </>
    );
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='view-profile-content'>
        {renderContent()}
        <div className='profile-footer'>
          <button className='action-btn' onClick={onEditClick}>Edit Profile</button>
          <button className='action-btn danger'>Delete Profile</button>
        </div>
        <div className='privacy-links'>
          <a className='privacy-link' href='#'>Privacy Policy</a>
          <span>&middot;</span>
          <a className='privacy-link' href='#'>Terms of Service</a>
        </div>
      </div>
    </Popup>
  );
};

export default ViewProfilePopup;