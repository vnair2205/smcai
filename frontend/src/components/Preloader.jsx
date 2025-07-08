import React from 'react';
import './Preloader.css';

const Preloader = ({ text = "Loading..." }) => {
  return (
    <div className="preloader-overlay">
      <div className="preloader-container">
        <div className="preloader-spinner"></div>
        <p className="preloader-text">{text}</p>
      </div>
    </div>
  );
};

export default Preloader;
