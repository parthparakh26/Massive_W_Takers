import React from 'react'
import './HomePage.css'
import Navbar from '../../components/Navbar/Navbar';
import { AboutUs } from '../../components/AboutUs/AboutUs';

const HomePage = () => {
  return (
    <div className="HomePage">
      <Navbar />
      <AboutUs />
    </div>
  )
}

export default HomePage