import React from 'react';
import './PlanPopup.css'; // Updated CSS file import

const PlanPopup = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="planPopup__overlay">
      <div className="planPopup__content">
        <span className="planPopup__closeBtn" onClick={onClose}>X</span>
        <h2 className="planPopup__heading">Choose Your Plan</h2>
        <div className="planPopup__wrapper">

          {/* Annual Plan */}
          <div className="planPopup__box planPopup__box--annual">
            <h3 className="planPopup__title">Annual Plan</h3>
            <p className="planPopup__sub">The lowest cost plan</p>
            <p className="planPopup__priceStrike"><del>₹149 / Month</del></p>
            <h2 className="planPopup__price">₹ 99 / Month</h2>
            <div className="planPopup__validity">Validity 12 Months</div>
            <p className="planPopup__note">After Discount, The Total Price Of This Plan Is <strong>₹1200</strong>, Valid For <strong>365 Days</strong>.</p>
            <button className="planPopup__btn planPopup__btn--choose">Choose Plan</button>
          </div>

          {/* Semi-Annual Plan */}
          <div className="planPopup__box planPopup__box--semiAnnual">
            <h3 className="planPopup__title">Semi Annual Plan</h3>
            <p className="planPopup__sub">The Most Popular plan</p>
            <p className="planPopup__priceStrike"><del>₹150 / Month</del></p>
            <h2 className="planPopup__price">₹ 100 / Month</h2>
            <div className="planPopup__validity">Validity 6 Months</div>
            <p className="planPopup__note">After Discount, The Total Price Of This Plan Is <strong>₹600</strong>, Valid For <strong>180 Days</strong>.</p>
            <button className="planPopup__btn planPopup__btn--choose">Choose Plan</button>
          </div>

          {/* Monthly Plan */}
          <div className="planPopup__box planPopup__box--monthly">
            <h3 className="planPopup__title">Monthly Plan</h3>
            <p className="planPopup__sub">Good for beginners</p>
            <p className="planPopup__priceStrike"><del>₹150 / Month</del></p>
            <h2 className="planPopup__price">₹ 100 / Month</h2>
            <div className="planPopup__validity planPopup__validity--current">Validity 1 Month</div>
            <p className="planPopup__note">After Discount, The Total Price Of This Plan Is <strong>₹100</strong>, Valid For <strong>30 Days</strong>.</p>
            <button className="planPopup__btn planPopup__btn--current">Current Plan</button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PlanPopup;