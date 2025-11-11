import React, { useState, useEffect } from 'react';
import './TradeSelection.css';
import { useAuth } from '../../context/AuthContext';
import { backendFetch } from '../../utils/backendFetch';
import swal from 'sweetalert2';

const TradeSelection = () => {
  const { backendUserId } = useAuth();
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [isTradeOpen, setTradeOpen] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedLanguage, setSelectedLanguage] = useState({ id: null, name: 'Select Language' });
  const [selectedTrade, setSelectedTrade] = useState({ id: null, name: 'Loading...' });

  const [loading, setLoading] = useState(false);

  // 🔹 Load languages and user profile
  useEffect(() => {
    const languageMap = {
      English: 1, Hindi: 2, Marathi: 3, Bengali: 4,
      Tamil: 5, Telugu: 6, Gujarati: 7, Punjabi: 8
    };
    setLanguages(Object.entries(languageMap).map(([name, id]) => ({ id, name })));

    if (backendUserId) {
      backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
        .then(res => res.json())
        .then(data => {
          if (data.status && data.data) {
            const user = data.data;
            const userLang = Object.entries(languageMap).find(([name, id]) => id === user.language_id);
            if (userLang) {
              setSelectedLanguage({ id: user.language_id, name: userLang[0] });
            }
          }
        })
        .catch(err => console.error("Error fetching user profile:", err));
    }
  }, [backendUserId]);

  // 🔹 Fetch trades when language changes
  useEffect(() => {
    if (!selectedLanguage.id) return;

    setLoading(true);
    setSelectedTrade({ id: null, name: 'Loading Trades...' });

    backendFetch(`https://admin.online2study.in/api/get-categories/${selectedLanguage.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
          const savedTradeId = localStorage.getItem('userTrade');
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

  // 🔹 Update user profile on backend
  const updateUserProfile = async (languageId, categoryId) => {
    if (!backendUserId) return;

    try {
      const dataToSend = new FormData();
      dataToSend.append("language_id", languageId);
      dataToSend.append("category_id", categoryId);
      dataToSend.append("login_type", "google");

      const response = await backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/update`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: dataToSend
      });

      const result = await response.json();
      if (!result.status) throw new Error(result.message || "Failed to update");

      console.log("✅ Profile updated successfully on backend!");
      localStorage.setItem("userLang", String(languageId));
      localStorage.setItem("userTrade", String(categoryId));
    } catch (err) {
      console.error("Error updating user profile:", err);
    }
  };

  // 🔹 Event handlers
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setLanguageOpen(false);

    // Reset trade when language changes
    setSelectedTrade({ id: null, name: "Select Your Trade" });
    localStorage.removeItem("userTrade");

    // Update backend (language only)
    updateUserProfile(lang.id, selectedTrade.id || '');
  };

  const handleTradeSelect = (trade) => {
    setSelectedTrade(trade);
    setTradeOpen(false);
    localStorage.setItem("userTrade", trade.id);

    // Update backend (language + trade)
    updateUserProfile(selectedLanguage.id, trade.id);

    // ✅ Show SweetAlert only for trade update
    swal.fire({
            title : "Profile Updated!",
            text:"Your profile has been updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#4CAF50",
            background: "#f9f9f9",
            color: "#333",
            timer: 3000,
            timerProgressBar: true,
          }).then(() => {
            // ✅ Reload after clicking OK
            window.location.reload();
          })
  };

  // 🔹 JSX UI
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
