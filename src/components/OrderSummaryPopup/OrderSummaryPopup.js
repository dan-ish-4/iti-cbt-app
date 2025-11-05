import React from 'react';
import './OrderSummaryPopup.css';
import Popup from '../Popup/Popup';

// Placeholder images for payment logos
const razorpayLogo = "https://admin.online2study.in/razorpay/Razorpay-Logo.jpg";
const phonepeLogo = "https://admin.online2study.in/phonepe/Phonepe-Logo.webp";

const OrderSummaryPopup = ({ isOpen, onClose }) => {
  return (
    <Popup isOpen={isOpen} onClose={onClose}>
      <div className='order-box'>
        {/* Order Summary Section */}
        <div className='order-summary'>
          <h2>Order summary</h2>
          <div className='order-title'>Annual Plan</div>
          <div className='order-validity'>
            <div className='order-validity-text'>Plan Validity: 12 months</div>
            <div className='order-price'>
              <span className='order-old'>&#8377;1200</span>
              <span className='order-final'>&#8377;696</span>
            </div>
          </div>
          <div className='order-line'>
            <div className='label'>Discount (42%)</div>
            <div className='value'>-&#8377;504</div>
          </div>
          <div className='order-line'>
            <div className='label'>Taxes (0%)</div>
            <div className='value'>&#8377;0</div>
          </div>
          <hr />
          <div className='order-line total'>
            <div className='label'>Total</div>
            <div className='value order-total'>&#8377;696</div>
          </div>
        </div>

        {/* Payment Section */}
        <div className='order-payment'>
          <h2>Payment</h2>
          <a className='order-pay' href='#' target='_blank'>
            <span>Pay with </span>
            <img alt='Razorpay' src={razorpayLogo} />
          </a>
          <a className='order-pay' href='#' target='_blank'>
            <span>Pay with </span>
            <img alt='PhonePe' src={phonepeLogo} />
          </a>
        </div>
      </div>
    </Popup>
  );
};

export default OrderSummaryPopup;