import React from 'react';
import './PurchasedCourseCard.css';

// Helper function to format date strings
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateStr).toLocaleDateString('en-GB', options);
};

const PurchasedCourseCard = ({ course }) => {
  const detail = course.course_detail || {};
  const name = detail.name || "Course Name";
  const planType = course.plan_type || "N/A";
  const validTo = course.valid_to;
  const image = detail.banner
    ? `https://admin.online2study.in/uploads/courses/${detail.banner}`
    : "https://via.placeholder.com/60x60.png?text=📖";

  const planLabel =
    planType === "monthly" ? "1 Month Plan" :
    planType === "semi_annual" ? "6 Month Plan" :
    planType === "annual" ? "1 Year Plan" :
    planType;

  return (
    <div className="pur-box">
      <div className="pur-top">
        <div className="pur-img">
          <img src={image} alt="Course Icon" />
        </div>
        <div className="pur-details">
          <h3>{name}</h3>
          <p>Current Plan: {planLabel}</p>
          <p>Valid till: {formatDate(validTo)}</p>
        </div>
      </div>
      <div className="pur-actions">
        <button className="pur-btn pur-btn-upgrade">Upgrade</button>
        <button className="pur-btn pur-btn-enroll">Enroll Now</button>
      </div>
    </div>
  );
};

export default PurchasedCourseCard;