import React from 'react';
import './HomePage.css';
import UserProfileBanner from '../../components/UserProfileBanner/UserProfileBanner';
import TradeSelection from '../../components/TradeSelection/TradeSelection';
import PurchasedCourses from '../../components/PurchasedCourses/PurchasedCourses';
import AvailableCourses from '../../components/AvailableCourses/AvailableCourses';
import AllTrades from '../../components/AllTrades/AllTrades';

const HomePage = () => {
  return (
    <main className="homepage-container">
      <UserProfileBanner />
      <TradeSelection />
      <PurchasedCourses />
      <AvailableCourses />
      <AllTrades />
    </main>
  );
};

export default HomePage;