import React from 'react';

const Step5_Format = ({ nextStep, prevStep, handleChange, values }) => {
  const continueStep = e => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div>
    
      <div className="form-group">
        <label>Select the primary format for your course content:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="format"
              value="Video and Theory"
              checked={values.format === 'Video and Theory'}
              onChange={handleChange('format')}
            />
            Video and Theory
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="format"
              value="Image and Theory"
              checked={values.format === 'Image and Theory'}
              onChange={handleChange('format')}
            />
            Image and Theory
          </label>
        </div>
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep}>Next</button>
      </div>
    </div>
  );
};

export default Step5_Format;