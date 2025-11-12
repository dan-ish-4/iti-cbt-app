import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link/NavLink
import { useAuth } from '../../context/AuthContext';
import './BottomNav.css';

const BottomNav = ({ onProfileClick }) => {
  // A placeholder profile image URL
   const { profileImage } = useAuth();


  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({isActive}) => isActive ? "nav-btn active-home" : "nav-btn"}>
        <i className="fas fa-home"></i>
        <span>Home</span>
      </NavLink>
      <NavLink to="/practice" className="nav-btn">
        <i className="fas fa-chart-line"></i>
        <span>Score</span>
      </NavLink>
      <Link to="/p/course-dashboard.html" className="nav-btn course-btn">
        <div className="circle-icon">
          <i className="fas fa-book-reader"></i>
        </div>
        <span>Course</span>
      </Link>
      <NavLink to="/wallet" className="nav-btn">
        <i className="fas fa-wallet"></i>
        <span>Wallet</span>
      </NavLink>
      <a className="nav-btn" id="profile-link" onClick={onProfileClick}>
        <img alt="Profile" className="profile-img" src={profileImage} />
        <span>Profile</span>
      </a>
    </div>
  );
};

export default BottomNav;