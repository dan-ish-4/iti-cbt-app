import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Page and Layout Components
import Header from './components/Header/Header';
import BottomNav from './components/BottomNav/BottomNav';
import SlideOutMenu from './components/SlideOutMenu/SlideOutMenu';
import HomePage from './pages/HomePage/HomePage';
import ScorePage from './pages/ScorePage/ScorePage';
import WalletPage from './pages/WalletPage/WalletPage';
import CourseDashboardPage from './pages/CourseDashboardPage/CourseDashboardPage';

// Standalone Views / Popups
import LoginPopup from './components/LoginPopup/LoginPopup';
import UserProfilePopup from './components/UserProfilePopup/UserProfilePopup';
import Spinner from './components/Spinner/Spinner';
// Import other popups that will be controlled by state
import ViewProfilePopup from './components/ViewProfilePopup/ViewProfilePopup';
import LanguagePopup from './components/LanguagePopup/LanguagePopup';

function App() {
  const { currentUser, isProfileComplete, loading } = useAuth();

  // State for popups that are opened by user interaction inside the app
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewProfilePopupOpen, setViewProfilePopupOpen] = useState(false);
  const [isUpdateProfilePopupOpen, setUpdateProfilePopupOpen] = useState(false); // New state for editing
  const [isLanguagePopupOpen, setLanguagePopupOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleViewProfilePopup = () => setViewProfilePopupOpen(!isViewProfilePopupOpen);

  // This function handles the transition
  const openUpdateProfilePopup = () => {
    setViewProfilePopupOpen(false); // Close the view popup
    setUpdateProfilePopupOpen(true); // Open the edit popup
  };

  const closeUpdateProfilePopup = () => {
    setUpdateProfilePopupOpen(false);
  };

  const toggleLanguagePopup = () => setLanguagePopupOpen(!isLanguagePopupOpen);

  // 1. While the initial auth state is being determined, show a full-screen spinner.
  if (loading) {
    return <Spinner isLoading={true} />;
  }

  // 2. If there is no authenticated user, render ONLY the Login screen.
  if (!currentUser) {
    return <LoginPopup />;
  }

  // 3. If user is authenticated but profile is incomplete, render ONLY the profile completion form.
  if (!isProfileComplete) {
    // The UserProfilePopup will need logic to submit the form, which we'll add next.
    // For now, it will be visible. We pass a temporary onClose handler.
    return <UserProfilePopup isOpen={true} onClose={() => {}} />;
  }

  // 4. If user is logged in AND profile is complete, render the main application.
  return (
    <Router>
      <div className="App">
        <Header toggleMenu={toggleMenu} onLanguageClick={toggleLanguagePopup} />
        <SlideOutMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/practice" element={<ScorePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/p/course-dashboard.html" element={<CourseDashboardPage />} />
          </Routes>
        </main>

        {/* The profile button now opens the ViewProfilePopup */}
        <BottomNav onProfileClick={toggleViewProfilePopup} />

        {/* These popups are overlays for the authenticated app */}
        <ViewProfilePopup
          isOpen={isViewProfilePopupOpen}
          onClose={toggleViewProfilePopup}
          onEditClick={openUpdateProfilePopup}
        />

        {/* This is the popup for editing an existing profile */}
        {isUpdateProfilePopupOpen && (
          <UserProfilePopup
            isOpen={isUpdateProfilePopupOpen}
            onClose={closeUpdateProfilePopup}
            isUpdateMode={true}
          />
        )}
        
        <LanguagePopup isOpen={isLanguagePopupOpen} onClose={toggleLanguagePopup} />
      </div>
    </Router>
  );
}

export default App;
