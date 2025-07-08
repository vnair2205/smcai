import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader.jsx';

const Step8_Index = ({ nextStep, prevStep, values, setCourseData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (values.index && values.index.length > 0) return;

    const fetchIndex = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:5000/courses/generate-index', {
          topic: values.topic,
          subTopicCount: values.subTopicCount,
          language: values.language
        });
        // We will now process the data to match the new design structure
        const formattedIndex = response.data.index.map(st => ({
            ...st,
            // Prepend the subtopic title as the first "lesson" with a special flag
            lessons: [{title: st.title, isSubtopic: true}, ...st.lessons]
        }));
        setCourseData(prevData => ({ ...prevData, index: formattedIndex }));
      } catch (err) {
        setError('Failed to generate course index.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchIndex();
  }, []);

  const handleIndexChange = (subTopicIndex, lessonIndex, newTitle) => {
    // Create a deep copy to avoid direct state mutation
    const newIndex = JSON.parse(JSON.stringify(values.index));
    const currentLesson = newIndex[subTopicIndex].lessons[lessonIndex];
    
    // If we are editing the main subtopic title (the first lesson)
    if (currentLesson.isSubtopic) {
        // Update the root title property as well to maintain data consistency
        newIndex[subTopicIndex].title = newTitle;
    }
    // Update the title of the specific lesson input
    newIndex[subTopicIndex].lessons[lessonIndex].title = newTitle;

    setCourseData({ ...values, index: newIndex });
  };
  
  if (isLoading) {
    return <Preloader text="Building your course structure..." />;
  }

  return (
    <>
      {error ? <p style={{ color: 'red', textAlign: 'center' }}>{error}</p> : (
        <div className="index-container">
          {values.index.map((subTopic, subTopicIndex) => (
            <div key={subTopicIndex} className="subtopic-block">
              <label className="subtopic-label">Subtopic {subTopicIndex + 1}</label>
              <div className="lessons-container">
                {subTopic.lessons.map((lesson, lessonIndex) => (
                  <input
                    key={lessonIndex}
                    type="text"
                    value={lesson.title}
                    // Apply the special class if it's the main subtopic title
                    className={lesson.isSubtopic ? 'subtopic-title-input' : ''}
                    onChange={(e) => handleIndexChange(subTopicIndex, lessonIndex, e.target.value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
        <button className="button-next" onClick={nextStep} disabled={isLoading}>Next</button>
      </div>
    </>
  );
};

export default Step8_Index;
