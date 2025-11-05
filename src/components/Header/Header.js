import React from 'react';
import './Header.css';

const Header = ({ toggleMenu, onLanguageClick }) => { // Add onLanguageClick prop
  return (
    <header className='menuheadx' id='menuhead'>
      <nav id='voltamenu'>
        <div className='header-container'>
          <div className='hamburger-menu'>
            {/* Add onClick handler */}
            <button id='hamburger-toggle' onClick={toggleMenu}>
              <i className='fa fa-bars'></i>
            </button>
          </div>
          {/* ... rest of the component is unchanged ... */}
          <div className='center-logo'>
            <div className='logo'>
              <a href='/'>
                <span className='logo-name notranslate'>ITI CBT Exam Preparation</span>
              </a>
            </div>
          </div>
          <div className='right-controls'>
            <button className='language-btn' id='language-button' onClick={onLanguageClick}>
              <i className='fa fa-language'></i>
            </button>
            <div className="notification-btn">
              <i className="fa fa-bell"></i>
              <span className="notif-badge" id="notifCount">1</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;