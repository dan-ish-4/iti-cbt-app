import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUserId, setBackendUserId] = useState(null);
  const [isProfileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  function updateProfileStatus(isComplete) {
    setProfileComplete(isComplete);
    localStorage.setItem("userProfileCompleted", isComplete ? "true" : "false");
  }

  // This function replicates the handleLogin logic from your script
  async function handleBackendLogin(firebaseUser) {
    try {
      // Step 1: Send Firebase user info to your backend to get a session
      const sessionResponse = await fetch('https://admin.online2study.in/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName
        })
      });

      // The response is not clean JSON, so we parse it manually
      const text = await sessionResponse.text();
      const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const sessionData = JSON.parse(jsonString);

      if (!sessionData.sessionId || !sessionData.id) {
        throw new Error("Backend session creation failed");
      }

      localStorage.setItem('sessionId', sessionData.sessionId);
      localStorage.setItem('userId', sessionData.id);
      setBackendUserId(sessionData.id);

      // Step 2: Use the new backend userId to fetch the user's profile
      const profileResponse = await fetch(`https://admin.online2study.in/api/user/${sessionData.id}/profile`);
      const profileData = await profileResponse.json();

      if (!profileData.status || !profileData.data) {
        throw new Error("User profile not found on backend");
      }

      // Step 3: Check if the profile is complete
      const userProfile = profileData.data;
      const isComplete = userProfile.name && userProfile.phone_number && userProfile.language_id && userProfile.category_id;
      
      setProfileComplete(!!isComplete);
      localStorage.setItem("userProfileCompleted", isComplete ? "true" : "false");

    } catch (error) {
      console.error("Backend login or profile check failed:", error);
      // If any backend step fails, log the user out to ensure a clean state
      await logout();
    }
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await handleBackendLogin(result.user);
    }
    return result;
  }

  async function logout() {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // Attempt to log out from the backend, but don't block the flow if it fails
      fetch('https://admin.online2study.in/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      }).catch(err => console.error("Backend logout error:", err));
    }
    
    // Clear all local storage and state
    localStorage.clear();
    setBackendUserId(null);
    setProfileComplete(false);
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      const localUserId = localStorage.getItem('userId');

      if (user && localUserId) {
        // User is logged into Firebase and we have a backend ID.
        // Let's validate the profile state on every app load.
        setBackendUserId(localUserId);
        const isComplete = localStorage.getItem("userProfileCompleted") === "true";
        setProfileComplete(isComplete);
      } else {
        // No user or no session data, ensure logged out state
        setBackendUserId(null);
        setProfileComplete(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    backendUserId,
    isProfileComplete,
    loading,
    loginWithGoogle,
    logout,
    updateProfileStatus // Add this
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}