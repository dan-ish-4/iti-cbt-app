import React from 'react';
import './ViewProfilePopup.css';
import Popup from '../Popup/Popup';

const ViewProfilePopup = ({ isOpen, onClose }) => {
  const profileImageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgujRjGkIBqKVMdoC2rgHg0OhXXnOSCgccz1SIieEQvQJZf3Z1LLLwYk8ffU0ZtHKFF_jrT1V6BgCBsY9RZx6s5WRyNOKjM8D4fJMo4VuqfIJjFs_9KvN2CxZdVVQvWXFBOeIQ7LkJ6v4BadMeu73km0RkYr88e1cBmjd5ZrUg84sVYIWyui6VPaNBlqmKJ/s320/profile.png";

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='view-profile-content'>
        <div className='profile-header'>
          <div className='profile-avatar' style={{ backgroundImage: `url(${profileImageUrl})` }} />
          <p className='profile-email'>user@example.com</p>
        </div>
        <div className='profile-body'>
          <h3 className='profile-greeting'>Hi, User!</h3>
          <p><b>Phone:</b> <span id='profile-phone'>+91 1234567890</span></p>
          <p><b>Language:</b> <span id='profile-language'>Hindi</span></p>
          <p><b>Category:</b> <span id='profile-category'>Electrician</span></p>
        </div>
        <div className='profile-footer'>
          <button className='action-btn'>Edit Profile</button>
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