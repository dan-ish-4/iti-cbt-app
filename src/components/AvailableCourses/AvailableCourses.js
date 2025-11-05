import React, { useState, useEffect } from 'react';
import './AvailableCourses.css';
import CourseCard from '../CourseCard/CourseCard';

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = '1'; // Hardcode a user ID for demonstration

    fetch(`https://admin.online2study.in/api/courses/offers/${userId}`)
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
  }, []);

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
    return courses.map(course => (
      <CourseCard key={course.id} course={course} />
    ));
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
    </div>
  );
};

export default AvailableCourses;