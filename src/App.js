import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import router components
import Header from './components/Header/Header';
import SlideOutMenu from './components/SlideOutMenu/SlideOutMenu';
import BottomNav from './components/BottomNav/BottomNav';
import HomePage from './pages/HomePage/HomePage';
import ScorePage from './pages/ScorePage/ScorePage';
import WalletPage from './pages/WalletPage/WalletPage';
import CourseDashboardPage from './pages/CourseDashboardPage/CourseDashboardPage';
import LoginPopup from './components/LoginPopup/LoginPopup';
import UserProfilePopup from './components/UserProfilePopup/UserProfilePopup';
import ViewProfilePopup from './components/ViewProfilePopup/ViewProfilePopup';
import DeleteConfirmPopup from './components/DeleteConfirmPopup/DeleteConfirmPopup';
import PlanPopup from './components/PlanPopup/PlanPopup';
import OrderSummaryPopup from './components/OrderSummaryPopup/OrderSummaryPopup';
import LanguagePopup from './components/LanguagePopup/LanguagePopup'; // Import new component
import Spinner from './components/Spinner/Spinner'; // Import new component
import CustomAlert from './components/CustomAlert/CustomAlert'; // Import new component
import OrientationPopup from './components/OrientationPopup/OrientationPopup'; // Import new component

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const [isProfilePopupOpen, setProfilePopupOpen] = useState(false);
  const [isViewProfilePopupOpen, setViewProfilePopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isPlanPopupOpen, setPlanPopupOpen] = useState(false);
  const [isOrderSummaryPopupOpen, setOrderSummaryPopupOpen] = useState(false);
  const [isLanguagePopupOpen, setLanguagePopupOpen] = useState(false); // State for Language Popup
  const [isLoading, setIsLoading] = useState(false); // State for the spinner
  const [alertMessage, setAlertMessage] = useState(''); // State for the alert
  const [isOrientationPopupVisible, setOrientationPopupVisible] = useState(false); // State for orientation popup

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLoginPopup = () => setLoginPopupOpen(!isLoginPopupOpen);
  const toggleProfilePopup = () => setProfilePopupOpen(!isProfilePopupOpen);
  const toggleViewProfilePopup = () => setViewProfilePopupOpen(!isViewProfilePopupOpen);
  const toggleDeletePopup = () => setDeletePopupOpen(!isDeletePopupOpen);
  const togglePlanPopup = () => setPlanPopupOpen(!isPlanPopupOpen);
  const toggleOrderSummaryPopup = () => setOrderSummaryPopupOpen(!isOrderSummaryPopupOpen);
  const toggleLanguagePopup = () => setLanguagePopupOpen(!isLanguagePopupOpen); // Handler for Language Popup
  const toggleOrientationPopup = () => setOrientationPopupVisible(!isOrientationPopupVisible); // Handler

  // Handler to show an alert
  const showAlert = (message) => {
    setAlertMessage(message);
    // Optional: auto-hide after some time
    setTimeout(() => {
      setAlertMessage('');
    }, 5000);
  };

  // Handler to test the spinner
  const testSpinner = () => {
    setIsLoading(true);
    // Hide spinner after 2 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Router> {/* Wrap everything in the Router */}
      <div className="App">
        {/* Popups and global components can stay outside the Routes if they should be accessible everywhere */}
        <Spinner isLoading={isLoading} />
        <CustomAlert message={alertMessage} onClose={() => setAlertMessage('')} />
        <OrientationPopup isVisible={isOrientationPopupVisible} />
        <LoginPopup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />
        <UserProfilePopup isOpen={isProfilePopupOpen} onClose={toggleProfilePopup} />
        <ViewProfilePopup isOpen={isViewProfilePopupOpen} onClose={toggleViewProfilePopup} />
        <DeleteConfirmPopup isOpen={isDeletePopupOpen} onClose={toggleDeletePopup} />
        <PlanPopup isOpen={isPlanPopupOpen} onClose={togglePlanPopup} />
        <OrderSummaryPopup isOpen={isOrderSummaryPopupOpen} onClose={toggleOrderSummaryPopup} />
        <LanguagePopup isOpen={isLanguagePopupOpen} onClose={toggleLanguagePopup} />

        <Header toggleMenu={toggleMenu} onLanguageClick={toggleLanguagePopup} />
        <SlideOutMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

        <Routes> {/* Define the routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/practice" element={<ScorePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/p/course-dashboard.html" element={<CourseDashboardPage />} />
        </Routes>

        <BottomNav onProfileClick={toggleLoginPopup} />

        {/* --- Temporary Test Button for Spinner --- */}
        <button
          onClick={testSpinner}
          style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 1000, padding: '10px' }}
        >
          Test Spinner
        </button>

        {/* --- Temporary Test Button for Alert --- */}
        <button
          onClick={() => showAlert('This is a test alert!')}
          style={{ position: 'fixed', bottom: '150px', right: '20px', zIndex: 1000, padding: '10px' }}
        >
          Test Alert
        </button>

        {/* --- Temporary Test Button for Orientation Popup --- */}
        <button
          onClick={toggleOrientationPopup}
          style={{ position: 'fixed', bottom: '200px', right: '20px', zIndex: 1000, padding: '10px' }}
        >
          Test Orientation
        </button>
      </div>
    </Router>
  );
}

export default App;
