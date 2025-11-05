import React, { useState, useEffect } from 'react';
import './PurchasedCourses.css';
import PurchasedCourseCard from '../PurchasedCourseCard/PurchasedCourseCard';

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = '1'; // Hardcode a user ID for demonstration

    fetch(`https://admin.online2study.in/api/user/courses/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.status && Array.isArray(data.data)) {
          setCourses(data.data);
        } else {
          // Handle cases where data is not an array or status is false
          setCourses([]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Purchased Course Fetch Error:", err);
        setError("Error loading courses.");
        setIsLoading(false);
      });
  }, []);

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
      <PurchasedCourseCard key={course.id || course.course_id} course={course} />
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
      </div>
    </div>
  );
};

export default PurchasedCourses;