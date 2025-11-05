import React from 'react';
import './TradeCard.css';

const TradeCard = ({
  imageUrl = "https://via.placeholder.com/70x70.png?text=T",
  name = "Trade Name"
}) => {
  return (
    <div className="trade-card">
      <div className="trade-card-img">
        <img src={imageUrl} alt={name} loading="lazy" />
      </div>
      <div className="trade-card-name">{name}</div>
    </div>
  );
};

export default TradeCard;