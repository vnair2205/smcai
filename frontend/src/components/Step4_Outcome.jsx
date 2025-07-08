import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader.jsx';

const Step4_Outcome = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (values.outcome) return;
    if (!values.objective) {
        setError('No objective provided. Please go back to Step 3.');
        return;
    }

    const fetchOutcome = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/courses/generate-outcome', { 
            objective: values.objective,
            experienceLevel: values.experienceLevel,
            language: values.language
        });
        setCourseData(prevData => ({ ...prevData, outcome: response.data.outcome }));
      } catch (err) {
        setError('Failed to generate course outcome.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutcome();
  }, []);

  const continueStep = e => {
    e.preventDefault();
    if (!values.outcome || values.outcome.trim() === '') {
        alert('Please ensure the outcome is filled out.');
        return;
    }
    nextStep();
  };

  if (isLoading) {
    return <Preloader text="Defining key learning outcomes..." />;
  }

  return (
    <>
      <div className="form-group">
        <label htmlFor="outcome">Course Outcome</label>
        <textarea id="outcome" value={values.outcome} onChange={(e) => setCourseData({ ...values, outcome: e.target.value })} rows="6" />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep} disabled={isLoading}>Next</button>
      </div>
    </>
  );
};

export default Step4_Outcome;
