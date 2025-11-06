import React, { useState, useEffect } from 'react';
import './TradeSelection.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth to get the user ID

const TradeSelection = () => {
  const { backendUserId } = useAuth();
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [isTradeOpen, setTradeOpen] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [selectedLanguage, setSelectedLanguage] = useState({ id: null, name: 'Select Language' });
  const [selectedTrade, setSelectedTrade] = useState({ id: null, name: 'Loading...' });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Populate the static list of languages
    const languageMap = { "English": 1, "Hindi": 2, "Marathi": 3, "Bengali": 4, "Tamil": 5, "Telugu": 6, "Gujarati": 7, "Punjabi": 8 };
    setLanguages(Object.entries(languageMap).map(([name, id]) => ({ id, name })));

    // Fetch user's profile to set the initial language and trade
    if (backendUserId) {
      fetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
        .then(res => res.json())
        .then(data => {
          if (data.status && data.data) {
            const user = data.data;
            const userLang = Object.entries(languageMap).find(([name, id]) => id === user.language_id);
            if (userLang) {
              setSelectedLanguage({ id: user.language_id, name: userLang[0] });
            }
          }
        });
    }
  }, [backendUserId]);

  // Effect to fetch trade categories whenever the selected language changes
  useEffect(() => {
    if (!selectedLanguage.id) return;

    setLoading(true);
    setSelectedTrade({ id: null, name: 'Loading Trades...' }); // Show loading state
    fetch(`https://admin.online2study.in/api/get-categories/${selectedLanguage.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
          // After fetching, try to find the user's saved trade
          const savedTradeId = localStorage.getItem('userTrade'); // Or fetch from profile again
          const currentTrade = data.data.find(t => t.id == savedTradeId);
          setSelectedTrade(currentTrade || { id: null, name: 'Select Your Trade' });
        } else {
          setCategories([]);
          setSelectedTrade({ id: null, name: 'No Trades Found' });
        }
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setSelectedTrade({ id: null, name: 'Error Loading Trades' });
      })
      .finally(() => setLoading(false));
  }, [selectedLanguage.id]);
  
  const handleLanguageSelect = (lang) => {
      setSelectedLanguage(lang);
      setLanguageOpen(false);
      // In a full app, we would also call an API to update the user's language preference here.
  };

  const handleTradeSelect = (trade) => {
      setSelectedTrade(trade);
      setTradeOpen(false);
      // In a full app, we would call an API to update the user's trade here.
      localStorage.setItem('userTrade', trade.id); // Persist selection locally
  };

  return (
    <section className="trade-selection" id="userSection">
      {/* Language Selector */}
      <div className="trade-selector-wrapper">
        <div className="trade__header" onClick={() => setLanguageOpen(!isLanguageOpen)}>
          <i className="fas fa-language trade__icon"></i>
          <span className="trade__title">{selectedLanguage.name}</span>
          <i className={`fas fa-chevron-down trade__dropdown-icon ${isLanguageOpen ? 'open' : ''}`} />
        </div>
        {isLanguageOpen && (
          <div className="trade__content">
            <ul className="trade__list">
              {languages.map(lang => (
                <li key={lang.id} className="trade__item" onClick={() => handleLanguageSelect(lang)}>
                  {lang.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Trade Selector */}
      <div className="trade-selector-wrapper">
        <div className="trade__header" onClick={() => setTradeOpen(!isTradeOpen)}>
          <i className="fas fa-bolt trade__icon"></i>
          <span className="trade__title">{selectedTrade.name}</span>
          <i className={`fas fa-chevron-down trade__dropdown-icon ${isTradeOpen ? 'open' : ''}`} />
        </div>
        {isTradeOpen && (
          <div className="trade__content">
            <ul className="trade__list">
              {loading ? (
                <li className="trade__item">Loading...</li>
              ) : (
                categories.map(cat => (
                  <li key={cat.id} className="trade__item" onClick={() => handleTradeSelect(cat)}>
                    {cat.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default TradeSelection;