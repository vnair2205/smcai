import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step3_Objective = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!values.topic) {
        setError('No topic provided. Please go back to Step 1.');
        return;
    }
    if (values.objective) {
        return;
    }
    const fetchObjective = async () => {
      setIsLoading(true);
      setError('');
      try {
        const apiUrl = 'http://localhost:5000/courses/generate-objective';
        // Pass experienceLevel in the request
        const response = await axios.post(apiUrl, { 
            topic: values.topic, 
            experienceLevel: values.experienceLevel 
        });
        setCourseData(prevData => ({
          ...prevData,
          objective: response.data.objective
        }));
      } catch (err) {
        console.error("Error fetching course objective:", err);
        setError('Failed to generate course objective. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchObjective();
  }, []);

  const continueStep = e => {
    e.preventDefault();
    if (values.objective.trim() === '') {
        alert('Please ensure the objective is filled out.');
        return;
    }
    nextStep();
  };

  return (
    <div>
     
      <p>Based on your topic for a <strong>"{values.experienceLevel}"</strong> audience.</p>
      {isLoading ? (
        <p>Generating objective with AI...</p>
      ) : (
        <div className="form-group">
          <label htmlFor="objective">Course Objective</label>
          <textarea
            id="objective"
            value={values.objective}
            onChange={(e) => setCourseData({...values, objective: e.target.value})}
            placeholder="The AI-generated objective will appear here. You can edit it."
            rows="6"
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={continueStep} disabled={isLoading}>Next</button>
      </div>
    </div>
  );
};

export default Step3_Objective;
