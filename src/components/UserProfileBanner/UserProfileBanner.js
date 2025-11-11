import React, { useState, useEffect } from 'react';
import './UserProfileBanner.css';
import { useAuth } from '../../context/AuthContext';
import { backendFetch } from '../../utils/backendFetch';

const UserProfileBanner = () => {
  const { backendUserId } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  useEffect(() => {
    if (!backendUserId) {
      setUser({ name: 'Guest', profile_image: defaultAvatar });
      return;
    }

    backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        if (data.status && data.data) {
          const userData = data.data;

          // ✅ Handle profile image properly
          let imageUrl = defaultAvatar;
          if (userData.profile_image && userData.profile_image !== "string") {
            imageUrl = userData.profile_image.startsWith("http")
              ? userData.profile_image
              : `https://admin.online2study.in/storage/${userData.profile_image}`;
          }

          setUser({
            ...userData,
            profile_image: imageUrl
          });
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      })
      .catch(err => {
        console.error("Failed to load user profile:", err);
        setError('Could not load profile.');
        setUser({ name: 'User', profile_image: defaultAvatar });
      });
  }, [backendUserId]);

  const languageMap = {
    1: "English", 2: "Hindi", 3: "Marathi", 4: "Bengali",
    5: "Tamil", 6: "Telugu", 7: "Gujarati", 8: "Punjabi"
  };

  const userName = user ? user.name : 'Loading...';
  const userLanguage = user ? languageMap[user.language_id] : '--';
  const userImage = user ? user.profile_image : defaultAvatar;

  return (
    <section className="profile" id="userProfileSection">
      <div className="profile__info">
        {/* ✅ Dynamic User Profile Image */}
        <img
          src={userImage}
          alt="User Profile"
          className="profile__avatar-img"
          onError={(e) => (e.target.src = defaultAvatar)}
        />
        <div className="profile__text">
          <p className="profile__welcome">Welcome</p>
          <p className="profile__name">{error || userName}</p>
        </div>
      </div>
      <div className="profile__buttons">
        <button className="profile__btn profile__btn--balance" id="walletBalanceBtn">
          <i className="fas fa-coins"></i> ₹ --
        </button>
        <button className="profile__btn profile__btn--score">
          <i className="fas fa-bullseye"></i> Score
        </button>
        <button className="profile__btn profile__btn--language" id="userLangBtn">
          <i className="fas fa-language"></i> {userLanguage}
        </button>
      </div>
    </section>
  );
};

export default UserProfileBanner;
