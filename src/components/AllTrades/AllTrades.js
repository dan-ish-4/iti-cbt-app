import React, { useState, useEffect } from 'react';
import './AllTrades.css';
import TradeCard from '../TradeCard/TradeCard';
import { useAuth } from '../../context/AuthContext';
import { backendFetch } from '../../utils/backendFetch';

const AllTrades = () => {
  const { backendUserId } = useAuth();
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTradeId, setSelectedTradeId] = useState(Number(localStorage.getItem('userTrade')) || null);

  // 🔹 Load trades based on user language
  useEffect(() => {
    if (!backendUserId) {
      setIsLoading(false);
      return;
    }

    backendFetch(`https://admin.online2study.in/api/user/${backendUserId}/profile`)
      .then(res => res.json())
      .then(profileData => {
        if (profileData.status && profileData.data.language_id) {
          const languageId = profileData.data.language_id;
          return backendFetch(`https://admin.online2study.in/api/get-categories/${languageId}`);
        }
        throw new Error("Could not determine user language.");
      })
      .then(res => res.json())
      .then(categoryData => {
        if (categoryData.success && Array.isArray(categoryData.data)) {
          setTrades(categoryData.data);
        } else {
          setTrades([]);
        }
      })
      .catch(err => console.error("Error fetching trades for grid:", err))
      .finally(() => setIsLoading(false));
  }, [backendUserId]);

  // 🔹 🔁 Listen for localStorage changes (trade updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedTradeId = localStorage.getItem('userTrade');
      setSelectedTradeId(Number(updatedTradeId));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 🔹 Render content
  const renderContent = () => {
    if (isLoading) return <p className="status-message">Loading trades...</p>;
    if (trades.length === 0) return <p className="status-message">No trades found.</p>;
    return trades.map(trade => (
      <div
        key={trade.id}
        className={`trade-card-wrapper ${trade.id === selectedTradeId ? 'selected-trade' : ''}`}
      >
        <TradeCard
          name={trade.name}
          imageUrl={trade.photo ? `https://admin.online2study.in/storage/${trade.photo}` : undefined}
        />
      </div>
    ));
  };

  return (
    <div className="courses__section">
      <div className="courses-box trades-list-box">
        <div className="courses-header">
          <h2>All Trades</h2>
          <a href="#">View all</a>
        </div>
        <div className="trades-grid-container" id="TradesList">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AllTrades;
