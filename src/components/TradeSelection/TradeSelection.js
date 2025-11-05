import React, { useState } from 'react';
import './TradeSelection.css';

const TradeSelection = () => {
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [isTradeOpen, setTradeOpen] = useState(false);

  const toggleLanguageDropdown = () => setLanguageOpen(!isLanguageOpen);
  const toggleTradeDropdown = () => setTradeOpen(!isTradeOpen);

  return (
    <section className="trade-selection" id="userSection">
      {/* Language Selector */}
      <div className="trade-selector-wrapper">
        <div className="trade__header" onClick={toggleLanguageDropdown}>
          <i className="fas fa-language trade__icon"></i>
          <span className="trade__title" id="languageTitle">Select Language</span>
          <i
            className={`fas fa-chevron-down trade__dropdown-icon ${isLanguageOpen ? 'open' : ''}`}
          ></i>
        </div>
        {isLanguageOpen && (
          <div className="trade__content" id="LanguageDropdown">
            <ul className="trade__list">
              {/* Language items will be populated later */}
            </ul>
          </div>
        )}
      </div>

      {/* Trade Selector */}
      <div className="trade-selector-wrapper">
        <div className="trade__header" onClick={toggleTradeDropdown}>
          <i className="fas fa-bolt trade__icon"></i>
          <span className="trade__title" id="tradeTitle">Loading...</span>
          <i
            className={`fas fa-chevron-down trade__dropdown-icon ${isTradeOpen ? 'open' : ''}`}
          ></i>
        </div>
        {isTradeOpen && (
          <div className="trade__content" id="tradeDropdown">
            <ul className="trade__list">
              {/* Trade items will be populated later */}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default TradeSelection;