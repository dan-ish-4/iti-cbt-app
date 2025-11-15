import React, { useEffect, useState } from "react";
import "./PlanPopup.css";
import { useAuth } from "../../context/AuthContext";
import { backendFetch } from "../../utils/backendFetch";
import Spinner from "../Spinner/Spinner";

const PlanPopup = ({ isOpen, onClose }) => {
  const { backendUserId } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPlan, setCurrentPlan] = useState(""); // ✅ store which plan user currently has

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
          const course = data.data[0];
          const subs = course.subscription || {};

          // ✅ Example assumption: your backend might add this later
          // e.g., course.current_plan = "monthly" or "annual"
          setCurrentPlan(course.current_plan || "monthly"); // fallback if missing

          const formattedPlans = Object.entries(subs).map(([key, value]) => {
            // parse numeric values
            const finalAmount = Number(value.final_amount || value.amount || 0);
            const validityDays = Number(value.validity || 0);

            // estimate months from validity days.
            // for 365 days -> 12 months, otherwise round(validity/30)
            const months =
              validityDays >= 365 ? 12 : Math.max(1, Math.round(validityDays / 30));

            // compute monthly price
            const monthlyPrice = months > 0 ? +(finalAmount / months).toFixed(2) : finalAmount;

            return {
              id: key,
              name:
                key === "annual"
                  ? "Annual Plan"
                  : key === "semi_annual"
                    ? "Semi Annual Plan"
                    : "Monthly Plan",
              monthlyPrice,        // price per month (computed)
              validity: validityDays,
              totalPrice: finalAmount // total for the plan
            };
          });


          const sortedPlans = ["annual", "semi_annual", "monthly"]
            .map((k) => formattedPlans.find((p) => p.id === k))
            .filter(Boolean);

          setPlans(sortedPlans);
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

  const handleChoosePlan = (plan) => {
    console.log("Upgrading to:", plan);
    // Here you can trigger your Razorpay or payment flow.
    // Example: window.location.href = `/checkout?plan=${plan.id}`;
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
            plans.map((plan) => {
              const isCurrent = plan.id === currentPlan;

              return (
                <div
                  key={plan.id}
                  className={`planPopup__box planPopup__box--${plan.id} ${
                    isCurrent ? "planPopup__box--current" : ""
                  }`}
                >
                  <h3 className="planPopup__title">{plan.name}</h3>
                  <p className="planPopup__sub">
                    {plan.id === "annual"
                      ? "The lowest cost plan"
                      : plan.id === "semi_annual"
                      ? "The most popular plan"
                      : "Perfect for beginners"}
                  </p>

                  <h2 className="planPopup__price">₹ {plan.monthlyPrice} / Month</h2>
                  <div className="planPopup__validity">
                    Validity: {plan.validity} Days
                  </div>
                  <p className="planPopup__note">
                    Total Price: <strong>₹{plan.totalPrice}</strong>
                  </p>

                  {isCurrent ? (
                    <button className="planPopup__btn planPopup__btn--current" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button
                      className="planPopup__btn planPopup__btn--choose"
                      onClick={() => handleChoosePlan(plan)}
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PlanPopup;
