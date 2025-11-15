import React from 'react';
import './CourseCard.css';

// Helper function to format date strings
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateStr).toLocaleDateString('en-GB', options);
};

const CourseCard = ({ course, purchasedInfo, onBuyNowClick, onUpgradeClick }) => {
  const isPurchased = !!purchasedInfo;

  // Use general course info as a base
  const name = course?.name?.substring(0, 50) || "Course Name";

  const imageUrl = course?.banner
    ? `https://admin.online2study.in/uploads/courses/${course.banner}`
    : "https://via.placeholder.com/300x200?text=Course";

  // Price details
  const annualSub = course?.subscription?.annual;
  const oldPrice = annualSub?.amount || "N/A";
  const finalPrice = annualSub?.final_amount || "N/A";

  // Discount calculation
  const discount =
    !isPurchased && course?.offer?.subscription?.annual?.discount
      ? course.offer.subscription.annual.discount
      : oldPrice !== "N/A" && finalPrice !== "N/A"
      ? Math.round(((oldPrice - finalPrice) / oldPrice) * 100)
      : null;

  // Purchased course info
  const planType = purchasedInfo?.plan_type;
  const validTo = purchasedInfo?.valid_to;

  const planLabel =
    planType === "monthly"
      ? "1 Month Plan"
      : planType === "semi_annual"
      ? "6 Month Plan"
      : planType === "annual"
      ? "1 Year Plan"
      : planType;

  return (
    <div className={`course-card ${isPurchased ? 'is-purchased' : ''}`}>
      {discount > 0 && <div className="discount-badge">{discount}% OFF</div>}

      <div
        className="image-placeholder"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      ></div>

      <h3>{name}</h3>

      {isPurchased ? (
        <div className="purchased-details">
          <p><strong>Current Plan:</strong> {planLabel}</p>
          <p><strong>Valid till:</strong> {formatDate(validTo)}</p>
        </div>
      ) : (
        <p className="desc">
          All subjects: Learning Videos, Study Material, Practice Quiz,
          Mock Test, and Live Test included.
        </p>
      )}

      <div className="card-footer">
        {isPurchased ? (
          <button
            className="upgrade-btn"
            onClick={() => onUpgradeClick(purchasedInfo)}
          >
            Upgrade Now
          </button>
        ) : (
          <>
            <div className="price-container">
              <p className="price">
                <span className="old-price">₹{oldPrice}</span>
                <span className="new-price">₹{finalPrice}/Year Only</span>
              </p>
            </div>
            <button className="buy-btn" onClick={() => onBuyNowClick(course)}>
              Buy Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
