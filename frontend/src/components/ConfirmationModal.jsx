import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="button-back">Cancel</button>
          <button onClick={onConfirm} className="button-next">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;