import React, { useState, useEffect } from 'react';
import PlanPopup from '../PlanPopup/PlanPopup';
import './AvailableCourses.css';
import CourseCard from '../CourseCard/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { backendFetch } from '../../utils/backendFetch';

const AvailableCourses = () => {
    const { backendUserId } = useAuth(); // Get the ID from context
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlanPopupOpen, setIsPlanPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [purchasedCourses, setPurchasedCourses] = useState([]);


    useEffect(() => {
        if (backendUserId) { // Check if the ID exists
            backendFetch(`https://admin.online2study.in/api/courses/offers/${backendUserId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status && Array.isArray(data.data)) {
                        setCourses(data.data);
                    } else {
                        setCourses([]);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error("Available Course Fetch Error:", err);
                    setError("Error loading courses.");
                    setIsLoading(false);
                });
        } else {
            // You might still want to show courses for logged-out users
            // For now, we'll assume it requires a user ID
            setIsLoading(false);
            setCourses([]);
        }
    }, [backendUserId]); // Re-run if the ID changes


    useEffect(() => {
  if (!backendUserId) return;

  backendFetch(`https://admin.online2study.in/api/user/courses/${backendUserId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status && Array.isArray(data.data)) {
        setPurchasedCourses(data.data);
      } else {
        setPurchasedCourses([]);
      }
    })
    .catch(err => {
      console.error("Purchased Course Fetch Error:", err);
      setPurchasedCourses([]);
    });
}, [backendUserId]);

    const handleBuyNowClick = (course) => {
        setSelectedCourse(course);
        setIsPlanPopupOpen(true);
    };
  const handleUpgradeClick = (purchasedCourse) => {
    setSelectedCourse(purchasedCourse);
    setIsPlanPopupOpen(true);
  };
    const handleClosePlanPopup = () => {
        setIsPlanPopupOpen(false);
        setSelectedCourse(null);
    };

  const renderContent = () => {
  if (isLoading) {
    return <p className="status-message">Loading available courses...</p>;
  }
  if (error) {
    return <p className="status-message">{error}</p>;
  }
  if (courses.length === 0) {
    return <p className="status-message">No courses available at the moment.</p>;
  }

  return courses.map(course => {

    // ⭐ Purchased detection
  const purchasedInfo = purchasedCourses.find(
  p => p.course_id === course.id
) || null;

    return (
      <CourseCard
        key={course.id}
        course={course}
        purchasedInfo={purchasedInfo}
        onBuyNowClick={handleBuyNowClick}
        onUpgradeClick={handleUpgradeClick}
      />
    );
  });
};

  return (
    <div className="courses__section">
      <div className="courses-box">
        <div className="courses-header">
          <h2>Available Courses</h2>
          <a href="#">View all</a>
        </div>
        <div className="courses-list-container" id="CoursesList">
          {renderContent()}
        </div>
      </div>
      <PlanPopup
        isOpen={isPlanPopupOpen}
        onClose={handleClosePlanPopup}
        course={selectedCourse}
      />
    </div>
  );
};

export default AvailableCourses;

