import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, onBuyNowClick }) => {
  // Default values for safety
  const name = course?.name?.substring(0, 50) || "Course Name";
  const imageUrl = course?.banner
    ? `https://admin.online2study.in/uploads/courses/${course.banner}`
    : "https://via.placeholder.com/300x200?text=Course";
  
  const annualSub = course?.subscription?.annual;
  const oldPrice = annualSub?.amount || "N/A";
  const finalPrice = annualSub?.final_amount || "N/A";

  // A simple way to calculate discount percentage if not provided
  const discount = course?.offer?.subscription?.annual?.discount ||
                  (oldPrice !== "N/A" && finalPrice !== "N/A" ? Math.round(((oldPrice - finalPrice) / oldPrice) * 100) : null);

  return (
    <div className="course-card">
      {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}
      <div className="image-placeholder" style={{ backgroundImage: `url('${imageUrl}')` }}></div>
      <h3>{name}</h3>
      <p className="desc">All subjects: Learning Videos, Study Material, Practice Quiz, Mock Test, and Live Test included.</p>
      <div className="price-container">
        <p className="price">
          <span className="old-price">₹{oldPrice}</span>
          <span className="new-price">₹{finalPrice}/Year Only</span>
        </p>
      </div>
      <button className="buy-btn" onClick={() => onBuyNowClick(course)}>
        Buy Now
      </button>
    </div>
  );
};

export default CourseCard;