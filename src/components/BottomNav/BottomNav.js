import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import Link/NavLink
import './BottomNav.css';

const BottomNav = ({ onProfileClick }) => {
  // A placeholder profile image URL
  const profileImageUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgujRjGkIBqKVMdoC2rgHg0OhXXnOSCgccz1SIieEQvQJZf3Z1LLLwYk8ffU0ZtHKFF_jrT1V6BgCBsY9RZx6s5WRyNOKjM8D4fJMo4VuqfIJjFs_9KvN2CxZdVVQvWXFBOeIQ7LkJ6v4BadMeu73km0RkYr88e1cBmjd5ZrUg84sVYIWyui6VPaNBlqmKJ/s320/profile.png";

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
        <img alt="Profile" className="profile-img" src={profileImageUrl} />
        <span>Profile</span>
      </a>
    </div>
  );
};

export default BottomNav;