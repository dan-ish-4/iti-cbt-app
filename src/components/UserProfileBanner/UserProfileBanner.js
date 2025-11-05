import React, { useState, useEffect } from 'react';
import './UserProfileBanner.css';
import { useAuth } from '../../context/AuthContext';

const UserProfileBanner = () => {
    const { backendUserId } = useAuth(); // Get the ID from context
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!backendUserId) { // Check if the ID exists
            setUser({ name: 'Guest' });
            return;
        }

        fetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (data.status && data.data) {
                    setUser(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch user data');
                }
            })
            .catch(err => {
                console.error("Failed to load user profile:", err);
                setError('Could not load profile.');
                setUser({ name: 'User' }); // Fallback user
            });
    }, [backendUserId]); // Re-run if the ID changes

  // Define language map to translate language_id to a name
  const languageMap = {
    1: "English", 2: "Hindi", 3: "Marathi", 4: "Bengali",
    5: "Tamil", 6: "Telugu", 7: "Gujarati", 8: "Punjabi"
  };

  const userName = user ? user.name : 'Loading...';
  const userLanguage = user ? languageMap[user.language_id] : '--';

  return (
    <section className="profile" id="userProfileSection">
      <div className="profile__info">
        <i className="fas fa-user-circle profile__avatar"></i>
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