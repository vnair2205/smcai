import React from 'react';
import './Sidebar.css';
import logo from '../assets/SeekMYCOURSE_logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="SeekMYCOURSE Logo" className="logo" />
      </div>
      <nav className="sidebar-nav">
        <div className="menu-item active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
              <path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/>
              <path d="M5 3v4"/>
              <path d="M19 17v4"/>
          </svg>
          Generate Course
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
