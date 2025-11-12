import React, { useState, useEffect } from 'react';
import './UserProfilePopup.css';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner/Spinner';
import { backendFetch, getSessionId } from '../../utils/backendFetch';
import swal from 'sweetalert2';

const UserProfilePopup = ({ isOpen, onClose, isUpdateMode = false }) => {
  const { backendUserId, updateProfileStatus,setProfileImage } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    languageId: '2',
    categoryId: '',
    profileImage: null,
    profileImageUrl: "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  });
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languageMap = { "English": 1, "Hindi": 2, "Marathi": 3, "Bengali": 4, "Tamil": 5, "Telugu": 6, "Gujarati": 7, "Punjabi": 8 };

  const fetchCategories = async (languageId) => {
    if (!languageId) {
      setCategories([]);
      return;
    }
    try {
      const response = await backendFetch(`https://admin.online2study.in/api/get-categories/${languageId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load trade categories.");
      setCategories([]);
    }
  };

  useEffect(() => {
    setLanguages(Object.entries(languageMap).map(([name, id]) => ({ id, name })));

    if (backendUserId && isOpen) {
      setLoading(true);
      backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
        .then(res => res.json())
        .then(data => {
          if (data.status && data.data) {
            const user = data.data;
            let imageUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            if (user.profile_image && user.profile_image !== "string") {
              imageUrl = user.profile_image.startsWith("http")
                ? user.profile_image
                : `https://admin.online2study.in/storage/${user.profile_image}`;
            }

            const userLangId = user.language_id || '2';
            const userCategoryId = user.category_id || '';

            setFormData(prev => ({
              ...prev,
              name: user.name || '',
              mobile: user.phone_number || '',
              languageId: userLangId,
              categoryId: userCategoryId,
              profileImageUrl: imageUrl,
              profileImage: null
            }));

            fetchCategories(userLangId);
            if (userCategoryId) {
                setFormData(prev => ({ ...prev, categoryId: userCategoryId }));
            }
          }
        })
        .catch(err => {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [backendUserId, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "languageId") {
      setFormData(prev => ({ ...prev, categoryId: '' }));
      fetchCategories(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImageUrl: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.languageId || !formData.categoryId) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError('');

    const sessionId = getSessionId();
    if (!sessionId) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("name", formData.name);
    dataToSend.append("phone_number", formData.mobile);
    dataToSend.append("language_id", formData.languageId);
    dataToSend.append("category_id", formData.categoryId);
    dataToSend.append("login_type", "google");

    if (formData.profileImage) {
      dataToSend.append("profile_image", formData.profileImage);
    } else {
      dataToSend.append("profile_image", formData.profileImageUrl);
    }

    try {
      const response = await backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/update`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: dataToSend
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

     if (!result.status) {
  throw new Error(result.message || "Failed to update profile.");
}

swal.fire({
  title: "Profile Updated!",
  text: "Your profile has been updated successfully.",
  icon: "success",
  confirmButtonText: "OK",
  confirmButtonColor: "#4CAF50",
  background: "#f9f9f9",
  color: "#333",
  timer: 3000,
  timerProgressBar: true,
}).then(() => {
  // ✅ Instantly update BottomNav profile image
  const newImageUrl = formData.profileImageUrl;
  setProfileImage(newImageUrl);
  localStorage.setItem("userProfileImage", formData.profileImageUrl);
if (typeof setProfileImage === 'function') {
  setProfileImage(formData.profileImageUrl);
}

  onClose();
});

localStorage.setItem("userProfileCompleted", "true");
localStorage.setItem("userName", formData.name);
localStorage.setItem("userMobile", formData.mobile);
localStorage.setItem("userLang", String(formData.languageId));
localStorage.setItem("userTrade", String(formData.categoryId));

if (typeof updateProfileStatus === 'function') {
  updateProfileStatus(true);
}


    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='login-container'>
      <Spinner isLoading={loading} />
      <div className='login-box scrollable-popup'>
        <form onSubmit={handleSubmit} noValidate>
          <div className='popup-header'>
            <h2>{isUpdateMode ? 'Update Your Profile' : 'Complete Your Profile'}</h2>
            <button className="close-btn" onClick={onClose}>&#10006;</button>
          </div>
          
          <label htmlFor="imageInput" className='profile-image-container'>
            <img alt='User Profile' src={formData.profileImageUrl} />
            <div className='upload-icon'>+</div>
          </label>
          <input accept='image/*' id='imageInput' type='file' style={{ display: 'none' }} onChange={handleImageChange} />
          
          <div className='profile-form'>
            {error && <p className="form-error">{error}</p>}
            
            <label className='form-label'>User Name</label>
            <div className='form-input-group'>
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder='Enter Your Name' type='text' required />
            </div>

            <label className='form-label'>Mobile Number</label>
            <div className='form-input-group'>
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder='Enter Mobile Number' type='tel' required />
            </div>

            <label className='form-label'>Select Your Language</label>
            <select name="languageId" value={formData.languageId} onChange={handleInputChange} className='form-dropdown' required>
              <option value="" disabled>-- Select Language --</option>
              {languages.map(lang => <option key={lang.id} value={lang.id}>{lang.name}</option>)}
            </select>

            <label className='form-label'>Select Your Trade</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className='form-dropdown' disabled={!formData.languageId || categories.length === 0} required>
               <option value="" disabled>{!formData.languageId ? '-- Select a language first --' : (categories.length === 0 ? '-- No trades available --' : '-- Select Trade --')}</option>
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
