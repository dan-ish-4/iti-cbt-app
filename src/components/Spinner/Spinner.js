import React from 'react';
import './Spinner.css';

const Spinner = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className='spinner-overlay'>
      <div className='spinner-icon' />
    </div>
  );
};

export default Spinner;