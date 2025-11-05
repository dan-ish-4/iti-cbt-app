import React from 'react';
import './LanguagePopup.css';
import Popup from '../Popup/Popup';

const LanguagePopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='language-popup-content'>
        <h2 className='language-heading'>Application Language</h2>
        {/* Placeholder for the Google Translate widget */}
        <div id='google_translate_element'>
          <select className='language-select'>
            <option>English</option>
            <option>Hindi</option>
            <option>Bengali</option>
            <option>Marathi</option>
            {/* Add other languages as needed */}
          </select>
        </div>
      </div>
    </Popup>
  );
};

export default LanguagePopup;