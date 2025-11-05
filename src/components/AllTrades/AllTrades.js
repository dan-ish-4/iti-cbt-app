import React from 'react';
import './AllTrades.css';
import TradeCard from '../TradeCard/TradeCard';

const AllTrades = () => {
  return (
    <div className="courses__section">
      <div className="courses-box trades-list-box">
        <div className="courses-header">
          <h2>All Trades</h2>
          <a href="#">View all</a>
        </div>
        <div className="trades-grid-container" id="TradesList">
          {/* Render a few cards to show the grid layout */}
          <TradeCard name="Electrician" />
          <TradeCard name="Fitter" />
          <TradeCard name="COPA" />
          <TradeCard name="Mechanic" />
        </div>
      </div>
    </div>
  );
};

export default AllTrades;