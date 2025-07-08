import React from 'react';

const Step2_ExperienceLevel = ({ nextStep, prevStep, handleChange, values }) => {
  const continueStep = e => {
    e.preventDefault();
    nextStep();
  };

  return (
    <>
      <div className="form-group">
        <label>Who is this course for?</label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="experienceLevel" value="Beginner" checked={values.experienceLevel === 'Beginner'} onChange={handleChange('experienceLevel')} />
            Beginner
          </label>
          <label className="radio-label">
            <input type="radio" name="experienceLevel" value="Intermediate" checked={values.experienceLevel === 'Intermediate'} onChange={handleChange('experienceLevel')} />
            Intermediate
          </label>
          <label className="radio-label">
            <input type="radio" name="experienceLevel" value="Advanced" checked={values.experienceLevel === 'Advanced'} onChange={handleChange('experienceLevel')} />
            Advanced
          </label>
        </div>
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep}>Next</button>
      </div>
    </>
  );
};

export default Step2_ExperienceLevel;