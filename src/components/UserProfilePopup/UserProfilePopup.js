import React from 'react';
import './UserProfilePopup.css';
import Popup from '../Popup/Popup'; // Import the wrapper

const UserProfilePopup = ({ isOpen, onClose }) => {
  const profileImageUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='profile-form-box'>
        <h2>User Profile</h2>
        <div className='profile-image-container'>
          <img alt='User' id='profileImage' src={profileImageUrl} />
          <div className='upload-icon'>+</div>
          {/* Hidden file input for image upload */}
          <input accept='image/*' id='imageInput' type='file' style={{ display: 'none' }} />
        </div>
        <div className='profile-form'>
          <label className='form-label'>User Name</label>
          <div className='form-input-group'>
            <input id='userNameInput' placeholder='Enter Your Name' type='text' />
          </div>

          <label className='form-label'>Mobile Number</label>
          <div className='form-input-group'>
            <input id='userMobileInput' placeholder='Enter Mobile Number' type='text' />
          </div>

          <label className='form-label'>Select Your Language</label>
          <select className='form-dropdown' id='trad-language-Select'>
            {/* Options will be populated dynamically later */}
            <option>Hindi</option>
            <option>English</option>
          </select>

          <label className='form-label'>Select Your Trade</label>
          <select className='form-dropdown' id='categorySelect'>
            {/* Options will be populated dynamically later */}
            <option>Electrician</option>
            <option>Fitter</option>
          </select>

          <div id='profileButtons'>
            <button className='continue-btn' id='profileSubmitBtn'>Continue</button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default UserProfilePopup;