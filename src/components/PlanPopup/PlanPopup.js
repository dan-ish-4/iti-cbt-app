import React, { useEffect, useState } from "react";
import "./PlanPopup.css";
import { useAuth } from "../../context/AuthContext";
import { backendFetch } from "../../utils/backendFetch";
import Spinner from "../Spinner/Spinner";

const PlanPopup = ({ isOpen, onClose }) => {
  const { backendUserId } = useAuth(); // ✅ Get current user ID
  const [plans, setPlans] = useState([]); // To hold subscription options
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !backendUserId) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await backendFetch(
          `https://admin.online2study.in/api/courses/offers/${backendUserId}`
        );
        const data = await response.json();

        if (data.status && Array.isArray(data.data) && data.data.length > 0) {
          // ✅ Extract subscription data (annual, semi-annual, monthly)
          const course = data.data[0];
          const subs = course.subscription || {};

          // Convert to an array for rendering easily
          const formattedPlans = Object.entries(subs).map(([key, value]) => ({
            id: key,
            name:
              key === "annual"
                ? "Annual Plan"
                : key === "semi_annual"
                ? "Semi Annual Plan"
                : "Monthly Plan",
            price: value.amount,
            validity: value.validity,
            finalAmount: value.final_amount,
          }));

          setPlans(formattedPlans);
        } else {
          setError("No plans available right now.");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isOpen, backendUserId]);

  // ✅ Handle plan selection
  const handleChoosePlan = (plan) => {
    console.log("Selected Plan:", plan);
    // Example: redirect or trigger payment flow
    // window.location.href = `/checkout?planType=${plan.id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="planPopup__overlay">
      <div className="planPopup__content">
        <span className="planPopup__closeBtn" onClick={onClose}>
          X
        </span>

        <h2 className="planPopup__heading">Choose Your Plan</h2>

        {loading && <Spinner isLoading={true} />}
        {error && <p className="planPopup__error">{error}</p>}

        <div className="planPopup__wrapper">
          {!loading &&
            !error &&
            plans.map((plan) => (
              <div
                key={plan.id}
                className={`planPopup__box planPopup__box--${plan.id}`}
              >
                <h3 className="planPopup__title">{plan.name}</h3>
                <p className="planPopup__sub">
                  {plan.id === "annual"
                    ? "The lowest cost plan"
                    : plan.id === "semi_annual"
                    ? "The most popular plan"
                    : "Perfect for beginners"}
                </p>

                <h2 className="planPopup__price">₹ {plan.price} / Month</h2>
                <div className="planPopup__validity">
                  Validity: {plan.validity} Days
                </div>
                <p className="planPopup__note">
                  Total Price: <strong>₹{plan.finalAmount}</strong>
                </p>

                <button
                  className="planPopup__btn planPopup__btn--choose"
                  onClick={() => handleChoosePlan(plan)}
                >
                  Choose Plan
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlanPopup;
