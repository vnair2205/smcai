import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader.jsx';

const Step3_Objective = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (values.objective) return;
    if (!values.topic) {
        setError('No topic provided. Please go back to Step 1.');
        return;
    }
    
    const fetchObjective = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/courses/generate-objective', { 
            topic: values.topic, 
            experienceLevel: values.experienceLevel,
            language: values.language
        });
        setCourseData(prevData => ({ ...prevData, objective: response.data.objective }));
      } catch (err) {
        setError('Failed to generate course objective. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchObjective();
  }, []);

  const continueStep = e => {
    e.preventDefault();
    if (!values.objective || values.objective.trim() === '') {
        alert('Please ensure the objective is filled out.');
        return;
    }
    nextStep();
  };

  if (isLoading) {
    return <Preloader text="Our AI is writing the perfect objective..." />;
  }

  return (
    <>
      <div className="form-group">
        <label htmlFor="objective">Course Objective</label>
        <textarea id="objective" value={values.objective} onChange={(e) => setCourseData({ ...values, objective: e.target.value })} rows="6" />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep} disabled={isLoading}>Next</button>
      </div>
    </>
  );
};

export default Step3_Objective;
