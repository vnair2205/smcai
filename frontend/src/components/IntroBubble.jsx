import React from 'react';
import './IntroBubble.css';

const IntroBubble = ({ onClose }) => {
  return (
    <div className="intro-bubble">
      <button onClick={onClose} className="intro-bubble-close-btn">&times;</button>
      <p>
        <strong>Psst! Need help?</strong>
        <br />
        I'm TANISI, your AI teacher for this course. Click my icon if you have any questions!
      </p>
    </div>
  );
};

export default IntroBubble;
