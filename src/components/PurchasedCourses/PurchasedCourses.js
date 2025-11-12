import React, { useState, useEffect } from 'react';
import PlanPopup from '../PlanPopup/PlanPopup';
import './PurchasedCourses.css';
import PurchasedCourseCard from '../PurchasedCourseCard/PurchasedCourseCard';
import { useAuth } from '../../context/AuthContext';
import { backendFetch } from '../../utils/backendFetch';

const PurchasedCourses = () => {
    const { backendUserId } = useAuth(); // Get the ID from context
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlanPopupOpen, setIsPlanPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (backendUserId) { // Check if the ID exists
            backendFetch(`https://admin.online2study.in/api/user/courses/${backendUserId}`)
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
                    console.error("Purchased Course Fetch Error:", err);
                    setError("Error loading courses.");
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setCourses([]); // If no user, there are no purchased courses
        }
    }, [backendUserId]); // Re-run if the ID changes

    const handleUpgradeClick = (course) => {
        setSelectedCourse(course);
        setIsPlanPopupOpen(true);
    };

    const handleClosePlanPopup = () => {
        setIsPlanPopupOpen(false);
        setSelectedCourse(null);
    };

  const renderContent = () => {
    if (isLoading) {
      return <p className="status-message">Loading purchased courses...</p>;
    }
    if (error) {
      return <p className="status-message">{error}</p>;
    }
    if (courses.length === 0) {
      return <p className="status-message">No purchased courses found.</p>;
    }
    return courses.map(course => (
      <PurchasedCourseCard key={course.id || course.course_id} course={course} onUpgradeClick={handleUpgradeClick} />
    ));
  };

  return (
    <div className="courses__section">
      <div className="courses-box">
        <div className="courses-header">
          <h2>Purchased Courses</h2>
          <a href="#">View all</a>
        </div>
        <div className="courses-list-container" id="PurchasedList">
          {renderContent()}
        </div>
        <div className="dots-container" id="PurchasedDots">
          {/* Statically generate dots for now */}
          {courses.length > 1 && courses.map((_, index) => (
            <div key={index} className={`dot ${index === 0 ? 'active' : ''}`}></div>
          ))}
        </div>
        <PlanPopup
          isOpen={isPlanPopupOpen}
          onClose={handleClosePlanPopup}
          course={selectedCourse}
        />
      </div>
    </div>
  );
};

export default PurchasedCourses;
