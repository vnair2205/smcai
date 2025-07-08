import React from 'react';

const Step5_SubTopics = ({ nextStep, prevStep, handleChange, values }) => {
  return (
    <>
      <div className="form-group">
        <label htmlFor="subTopicCount">Number of Sub-topics</label>
        <select id="subTopicCount" value={values.subTopicCount} onChange={handleChange('subTopicCount')} className="form-select">
          <option value="5">5 Sub-topics</option>
          <option value="10">10 Sub-topics</option>
          <option value="15">15 Sub-topics</option>
        </select>
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={nextStep}>Next</button>
      </div>
    </>
  );
};

export default Step5_SubTopics;
