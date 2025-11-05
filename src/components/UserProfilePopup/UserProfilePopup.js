import React, { useState, useEffect } from 'react';
import './UserProfilePopup.css';
import Popup from '../Popup/Popup';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner/Spinner';

const UserProfilePopup = ({ isOpen, onClose, isUpdateMode = false }) => {
  const { backendUserId, updateProfileStatus } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    languageId: '',
    categoryId: '',
    profileImage: null,
    profileImageUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  });
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (backendUserId) {
      fetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
        .then(res => res.json())
        .then(data => {
          if (data.status && data.data) {
            const user = data.data;
            
            // FIX: Check if the image path is already a full URL or null
            let imageUrl = formData.profileImageUrl; // Default
            if (user.profile_image) {
              if (user.profile_image.startsWith('http')) {
                imageUrl = user.profile_image; // It's already a full URL
              } else {
                imageUrl = `https://admin.online2study.in/storage/${user.profile_image}`; // Prepend base path
              }
            }

            setFormData(prev => ({
              ...prev,
              name: user.name || '',
              mobile: user.phone_number || '',
              languageId: user.language_id || '2',
              categoryId: user.category_id || '',
              profileImageUrl: imageUrl
            }));
            if(user.language_id) fetchCategories(user.language_id);
          }
        });
    }
    const languageMap = { "English": 1, "Hindi": 2, "Marathi": 3, "Bengali": 4, "Tamil": 5, "Telugu": 6, "Gujarati": 7, "Punjabi": 8 };
    setLanguages(Object.entries(languageMap).map(([name, id]) => ({ id, name })));
  }, [backendUserId]);

  const fetchCategories = (languageId) => { /* ... no changes ... */ };
  const handleInputChange = (e) => { /* ... no changes ... */ };
  const handleImageChange = (e) => { /* ... no changes ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.languageId || !formData.categoryId) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError('');

    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);
    apiFormData.append("phone_number", formData.mobile);
    apiFormData.append("language_id", formData.languageId);
    apiFormData.append("category_id", formData.categoryId);
    apiFormData.append("login_type", "google");
    if (formData.profileImage) {
      apiFormData.append("profile_image", formData.profileImage);
    }

    try {
      const response = await fetch(`https://admin.online2study.in/api/user/${backendUserId}/update`, {
        method: "POST",
        credentials: 'include',
        headers: {
          // FIX: Add 'Accept' header to tell the server we expect a JSON response.
          // This is crucial for many PHP/Laravel backends to correctly handle API sessions.
          'Accept': 'application/json',
        },
        body: apiFormData
      });

      if (!response.ok) {
        // If we get a non-JSON error page (like a 419 HTML page), this will now fail gracefully.
        if (response.headers.get("content-type")?.indexOf("application/json") === -1) {
             throw new Error(`Server returned a non-JSON response. Status: ${response.status}`);
        }
        const errorResult = await response.json();
        throw new Error(errorResult.message || `Request failed with status ${response.status}`);
      }
      
      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message || "Failed to update profile.");
      }

      updateProfileStatus(true);
      if (isUpdateMode) {
          onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
      <Spinner isLoading={loading} />
      <div className='login-box scrollable-popup'>
        <form onSubmit={handleSubmit}>
          <h2>{isUpdateMode ? 'Update Your Profile' : 'Complete Your Profile'}</h2>
          {/* ... The rest of the JSX form is unchanged ... */}
        </form>
      </div>
    </div>
  );
};

export default UserProfilePopup;