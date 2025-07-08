import React from 'react';
import './MediaPreloader.css';

const MediaPreloader = ({ text }) => {
  return (
    <div className="media-preloader">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default MediaPreloader;
