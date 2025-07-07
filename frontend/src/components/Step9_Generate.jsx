import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step8_Generate = ({ prevStep, values }) => {
  // State to hold the course as it's being populated with content
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // When the component loads, initialize the course state with the data from previous steps.
  // We use JSON.parse and JSON.stringify for a deep copy to avoid modifying the original 'values' prop.
  useEffect(() => {
    if (values && !course) {
      setCourse(JSON.parse(JSON.stringify(values)));
    }
  }, [values, course]);

  const handleLessonClick = async (subTopicIndex, lessonIndex) => {
    const lesson = course.index[subTopicIndex].lessons[lessonIndex];

    // If content already exists or is loading, do nothing.
    if (lesson.content || lesson.isLoading) {
      return;
    }

    // Create a deep copy of the course to modify
    const newCourseState = JSON.parse(JSON.stringify(course));
    
    // Set loading state for the specific lesson
    newCourseState.index[subTopicIndex].lessons[lessonIndex].isLoading = true;
    setCourse(newCourseState);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/courses/generate-lesson-content', {
        lessonTitle: lesson.title,
        format: values.format,
        topic: values.topic,
        language: values.language
      });

      // Update the lesson with the generated content and remove the loading state
      const finalCourseState = JSON.parse(JSON.stringify(newCourseState));
      finalCourseState.index[subTopicIndex].lessons[lessonIndex] = {
        ...lesson,
        ...response.data,
        isLoading: false,
      };
      setCourse(finalCourseState);

    } catch (err) {
      console.error("Error generating lesson content:", err);
      setError(`Failed to generate content for "${lesson.title}". Please try again.`);
      // Revert loading state on error
      const errorCourseState = JSON.parse(JSON.stringify(newCourseState));
      delete errorCourseState.index[subTopicIndex].lessons[lessonIndex].isLoading;
      setCourse(errorCourseState);
    }
  };

  const handleSaveCourse = async () => {
    if (!course) {
      setSaveStatus('Course data is not available.');
      return;
    }
    setSaveStatus('Saving course...');
    try {
      const response = await axios.post('http://localhost:5000/courses/save', course);
      setSaveStatus(response.data.msg);
    } catch (err) {
      console.error("Error saving course:", err);
      setSaveStatus('Failed to save course.');
    }
  };

  // Render a loading spinner if the initial course data hasn't been set yet
  if (!course) {
    return <p>Loading course structure...</p>;
  }

  return (
    <div>
      
      <p>Click on a lesson title to generate its content on-demand.</p>
      
      <div className="final-course-container">
        <h3>{course.topic}</h3>
        {course.index.map((subTopic, sIndex) => (
          <div key={sIndex} className="final-sub-topic">
            <h4>{subTopic.title}</h4>
            {subTopic.lessons.map((lesson, lIndex) => (
              <div key={lIndex} className="final-lesson">
                <h5 className="lesson-title-clickable" onClick={() => handleLessonClick(sIndex, lIndex)}>
                  {lesson.title}
                </h5>
                {lesson.isLoading && <p className="status-message">Generating...</p>}
                {lesson.content && (
                  <div className="lesson-content-wrapper">
                    {lesson.videoUrl && <img src={lesson.videoUrl} alt={`Video for ${lesson.title}`} />}
                    {lesson.imageUrl && <img src={lesson.imageUrl} alt={`Image for ${lesson.title}`} />}
                    <p className="lesson-content">{lesson.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleSaveCourse} className="button-save">Save Course</button>
        {saveStatus && <p className="status-message">{saveStatus}</p>}
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="button-group">
        <button className="button-back" onClick={prevStep}>Back</button>
      </div>
    </div>
  );
};

export default Step8_Generate;
