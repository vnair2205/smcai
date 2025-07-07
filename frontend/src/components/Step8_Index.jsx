import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step7_Index = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch if the index is empty to prevent re-fetching on back/next navigation
    if (values.index && values.index.length > 0) {
      return;
    }

    const fetchIndex = async () => {
      setIsLoading(true);
      setError('');
      try {
        const apiUrl = 'http://localhost:5000/courses/generate-index';
        const response = await axios.post(apiUrl, {
          topic: values.topic,
          objective: values.objective,
          outcome: values.outcome,
          subTopicCount: values.subTopicCount,
          language: values.language,
        });

        setCourseData(prevData => ({
          ...prevData,
          index: response.data.index
        }));

      } catch (err) {
        console.error("Error fetching course index:", err);
        setError('Failed to generate course index. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndex();
  }, []);

  const handleIndexChange = (subTopicIndex, lessonIndex, newTitle) => {
    const newIndex = [...values.index];
    if (lessonIndex === null) {
      // It's a sub-topic title change
      newIndex[subTopicIndex].title = newTitle;
    } else {
      // It's a lesson title change
      newIndex[subTopicIndex].lessons[lessonIndex].title = newTitle;
    }
    setCourseData({ ...values, index: newIndex });
  };

  return (
    <div>
     
      <p>This is the generated structure for your course. You can edit any title.</p>

      {isLoading ? (
        <p>Generating course index with AI...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="index-container">
          {values.index.map((subTopic, subTopicIndex) => (
            <div key={subTopicIndex} className="sub-topic-group">
              <input
                type="text"
                value={subTopic.title}
                onChange={(e) => handleIndexChange(subTopicIndex, null, e.target.value)}
                className="sub-topic-input"
              />
              <ul className="lesson-list">
                {subTopic.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex}>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) => handleIndexChange(subTopicIndex, lessonIndex, e.target.value)}
                      className="lesson-input"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={nextStep} disabled={isLoading}>Next</button>
      </div>
    </div>
  );
};

export default Step7_Index;
