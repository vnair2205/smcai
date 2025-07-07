import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step4_Outcome = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!values.objective) {
        setError('No objective provided. Please go back to Step 3.');
        return;
    }
    if (values.outcome) {
        return;
    }
    const fetchOutcome = async () => {
      setIsLoading(true);
      setError('');
      try {
        const apiUrl = 'http://localhost:5000/courses/generate-outcome';
        // Pass experienceLevel in the request
        const response = await axios.post(apiUrl, { 
            objective: values.objective,
            experienceLevel: values.experienceLevel
        });
        setCourseData(prevData => ({
          ...prevData,
          outcome: response.data.outcome
        }));
      } catch (err) {
        console.error("Error fetching course outcome:", err);
        setError('Failed to generate course outcome. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOutcome();
  }, []);

  const continueStep = e => {
    e.preventDefault();
    if (values.outcome.trim() === '') {
        alert('Please ensure the outcome is filled out.');
        return;
    }
    nextStep();
  };

  return (
    <div>

      <p>This is what students will be able to do after completing the course.</p>
      {isLoading ? (
        <p>Generating outcome with AI...</p>
      ) : (
        <div className="form-group">
          <label htmlFor="outcome">Course Outcome</label>
          <textarea
            id="outcome"
            value={values.outcome}
            onChange={(e) => setCourseData({...values, outcome: e.target.value})}
            placeholder="The AI-generated outcome will appear here. You can edit it."
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

export default Step4_Outcome;
