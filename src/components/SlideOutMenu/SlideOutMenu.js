import React from 'react';
import './SlideOutMenu.css';

const SlideOutMenu = ({ isOpen, toggleMenu }) => {
  return (
    <>
      <div className={isOpen ? 'slide-menu active' : 'slide-menu'} id='slide-menu'>
        <div className='menu-logo'>App logo</div>
        <ul className='menu-list'>
          <li><a href='/'><i className='fas fa-home'></i> Home</a></li>
          <li><a href='/learning'><i className='fas fa-book-reader'></i> Course</a></li>
          <li><a href='/practice'><i className='fas fa-chart-line'></i> Score</a></li>
          <li><a href='/notifications'><i className='fas fa-bell'></i> Notification</a></li>
          <hr />
          <li><a href='/leaderboard'><i className='fas fa-user-circle'></i> Profile</a></li>
          <li><a href='/wallet'><i className='fas fa-wallet'></i> Wallet</a></li>
          <li><a href='/refer'><i className='fas fa-gift'></i> Refer and Earn</a></li>
          <li><a href='/feedback'><i className='fas fa-comment-dots'></i> Feedback</a></li>
          <hr />
          <li><a href='/policy'><i className='fas fa-shield-alt'></i> Policy</a></li>
          <li><a href='/refund-policy'><i className='fas fa-undo'></i> Refund Policy</a></li>
          <li><a href='/terms'><i className='fas fa-file-contract'></i> Terms and Conditions</a></li>
          <li><a href='/about'><i className='fas fa-info-circle'></i> About us</a></li>
          <li><a href='/contact'><i className='fas fa-phone-alt'></i> Contact us</a></li>
          <li id='logoutBtn'><i className='fas fa-sign-out-alt'></i> Log out</li>
        </ul>
      </div>
      {/* Overlay */}
      <div
        className={isOpen ? 'menu-overlay active' : 'menu-overlay'}
        id='menu-overlay'
        onClick={toggleMenu}
      ></div>
    </>
  );
};

export default SlideOutMenu;