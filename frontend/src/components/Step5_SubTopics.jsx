import React from 'react';

const Step4_SubTopics = ({ nextStep, prevStep, handleChange, values }) => {
  const continueStep = e => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div>
    
      <div className="form-group">
        <label htmlFor="subTopicCount">How many sub-topics do you want to break the course into?</label>
        <select
          id="subTopicCount"
          value={values.subTopicCount}
          onChange={handleChange('subTopicCount')}
          className="form-select" // We'll add a style for this
        >
          <option value="5">5 Sub-topics</option>
          <option value="10">10 Sub-topics</option>
          <option value="15">15 Sub-topics</option>
        </select>
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep}>Next</button>
      </div>
    </div>
  );
};

export default Step4_SubTopics;