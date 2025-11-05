import React from 'react';
import './PlanPopup.css';
import Popup from '../Popup/Popup';

const PlanPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='plan-popup-box'>
        <h2 className='plan-heading'>Choose Your Plan</h2>
        <div className='plan-popup-wrapper'>

          {/* Annual Plan Box */}
          <div className='plan-box plan-highlight'>
            <h3>Annual Plan</h3>
            <p className='plan-sub'>The lowest cost plan</p>
            <p><del>&#8377;100</del> / Month <span className='plan-badge'>42% Off</span></p>
            <h2>&#8377;58 / Month</h2>
            <div className='plan-validity'>Validity 12 Months</div>
            <p className='plan-note'>
              After Discount, The Total Price Of This Plan Is <strong>&#8377;696</strong>,
              Valid For <strong>365 Days</strong>.
            </p>
            <button className='plan-btn'>Choose Plan</button>
          </div>

          {/* Semi-Annual Plan Box */}
          <div className='plan-box plan-highlight'>
            <h3>Semi Annual Plan</h3>
            <p className='plan-sub'>The Most Popular plan</p>
            <p><del>&#8377;100</del> / Month <span className='plan-badge'>31% Off</span></p>
            <h2>&#8377;69 / Month</h2>
            <div className='plan-validity'>Validity 6 Months</div>
            <p className='plan-note'>
              After Discount, The Total Price Of This Plan Is <strong>&#8377;414</strong>,
              Valid For <strong>180 Days</strong>.
            </p>
            <button className='plan-btn'>Choose Plan</button>
          </div>

          {/* Monthly Plan Box */}
          <div className='plan-box plan-highlight'>
            <h3>Monthly Plan</h3>
            <p className='plan-sub'>Good for beginners</p>
            <p><del>&#8377;100</del> / Month <span className='plan-badge'>11% Off</span></p>
            <h2>&#8377;89 / Month</h2>
            <div className='plan-validity'>Validity 1 Month</div>
            <p className='plan-note'>
               After Discount, The Total Price Of This Plan Is <strong>&#8377;89</strong>,
               Valid For <strong>30 Days</strong>.
            </p>
            <button className='plan-btn'>Choose Plan</button>
          </div>

        </div>
      </div>
    </Popup>
  );
};

export default PlanPopup;