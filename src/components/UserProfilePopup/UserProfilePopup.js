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

  const fetchCategories = async (languageId) => {
    if (!languageId) {
      setCategories([]);
      return;
    }
    try {
      const response = await fetch(`https://admin.online2study.in/api/get-categories/${languageId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories for language ID: ${languageId}`);
      }
      const data = await response.json();
      if (data.status && data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
      setError("Failed to load categories.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "languageId") {
      fetchCategories(value);
      setFormData(prev => ({ ...prev, categoryId: '' })); // Reset category when language changes
    }
  };

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
          {/* FIX: The full form structure is restored here */}
          <form onSubmit={handleSubmit}>
            <h2>{isUpdateMode ? 'Update Your Profile' : 'Complete Your Profile'}</h2>
            
            <label htmlFor="imageInput" className='profile-image-container'>
              <img alt='User' src={formData.profileImageUrl} />
              <div className='upload-icon'>+</div>
            </label>
            <input accept='image/*' id='imageInput' type='file' style={{ display: 'none' }} onChange={handleImageChange} />
            
            <div className='profile-form'>
              {error && <p className="form-error">{error}</p>}
              
              <label className='form-label'>User Name</label>
              <div className='form-input-group'>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder='Enter Your Name' type='text' />
              </div>

              <label className='form-label'>Mobile Number</label>
              <div className='form-input-group'>
                <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder='Enter Mobile Number' type='text' />
              </div>

              <label className='form-label'>Select Your Language</label>
              <select name="languageId" value={formData.languageId} onChange={handleInputChange} className='form-dropdown'>
                <option value="" disabled>-- Select Language --</option>
                {languages.map(lang => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
              </select>

              <label className='form-label'>Select Your Trade</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className='form-dropdown' disabled={!formData.languageId || categories.length === 0}>
                 <option value="" disabled>-- Select Trade --</option>
                 {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              
              <div id='profileButtons'>
                <button type="submit" className='continue-btn' disabled={loading}>
                  {isUpdateMode ? 'Update' : 'Continue'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default UserProfilePopup;