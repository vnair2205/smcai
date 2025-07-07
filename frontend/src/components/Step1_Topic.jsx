import React from 'react';

const Step1_Topic = ({ nextStep, handleChange, values }) => {
  const continueStep = e => {
    e.preventDefault();
    if (values.topic.trim() === '') {
        alert('Please enter a topic.');
        return;
    }
    nextStep();
  };

  return (
    // The <h2> has been removed from here.
    <div>
      <div className="form-group">
        <label htmlFor="topic">What do you want to teach?</label>
        <input
          type="text"
          id="topic"
          value={values.topic}
          onChange={handleChange('topic')}
          placeholder="e.g., Introduction to Python Programming"
        />
      </div>
      <div className="button-group">
        <button className="button-next" onClick={continueStep}>Next</button>
      </div>
    </div>
  );
};

export default Step1_Topic;
