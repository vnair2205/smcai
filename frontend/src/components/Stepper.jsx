import React from 'react';
import './Stepper.css';

const Stepper = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="stepper-wrapper">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="step-item-wrapper">
            <div className={`step-item ${currentStep >= step ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}>
              {currentStep > step ? '✔' : step}
            </div>
            <div className="step-title">{`Step ${step}`}</div>
          </div>
          {index < steps.length - 1 && <div className={`step-connector ${currentStep > step ? 'completed' : ''}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
