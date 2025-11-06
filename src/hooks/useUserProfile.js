import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const languageMap = {
    1: "English", 2: "Hindi", 3: "Marathi", 4: "Bengali",
    5: "Tamil", 6: "Telugu", 7: "Gujarati", 8: "Punjabi"
};
const dummyImage = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

export function useUserProfile() {
    const { backendUserId } = useAuth();
    const [profile, setProfile] = useState(null);
    const [imageUrl, setImageUrl] = useState(dummyImage);
    const [languageName, setLanguageName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!backendUserId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const fetchProfile = async () => {
            try {
                // 1. Fetch main user profile
                const profileRes = await fetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`);
                const profileData = await profileRes.json();

                if (!profileData.status || !profileData.data) {
                    throw new Error("Failed to fetch user profile.");
                }
                
                const user = profileData.data;
                setProfile(user);

                // 2. Derive the profile image URL
                if (user.profile_image) {
                    if (user.profile_image.startsWith('http')) {
                        setImageUrl(user.profile_image);
                    } else {
                        setImageUrl(`https://admin.online2study.in/storage/${user.profile_image}`);
                    }
                } else {
                    setImageUrl(dummyImage);
                }

                // 3. Derive the language name
                const langName = languageMap[user.language_id] || 'N/A';
                setLanguageName(langName);

                // 4. Fetch category name if IDs are present
                if (user.language_id && user.category_id) {
                    const categoryRes = await fetch(`https://admin.online2study.in/api/get-categories/${user.language_id}`);
                    const categoryData = await categoryRes.json();
                    
                    if (categoryData.success && Array.isArray(categoryData.data)) {
                        const category = categoryData.data.find(c => c.id == user.category_id);
                        setCategoryName(category ? category.name : 'N/A');
                    } else {
                        setCategoryName('N/A');
                    }
                } else {
                    setCategoryName('N/A');
                }
            } catch (err) {
                console.error("UserProfileLoader Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

    }, [backendUserId]);

    return { profile, imageUrl, languageName, categoryName, loading, error };
}