import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader.jsx';
import MediaPreloader from './MediaPreloader.jsx';
import Chatbot from './Chatbot.jsx';
import Quiz from './Quiz.jsx';
import QuizResult from './QuizResult.jsx';
import ConfirmationModal from './ConfirmationModal.jsx';

const Step9_Generate = ({ values, goToHome }) => {
  const [course, setCourse] = useState(null);
  // State now only stores the *indices* of the active lesson
  const [activeLessonIndices, setActiveLessonIndices] = useState(null);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (values && !course) {
      const courseToShow = JSON.parse(JSON.stringify(values));
      courseToShow.index.forEach(st => {
          st.lessons = st.lessons.filter(l => !l.isSubtopic);
      });
      setCourse(courseToShow);
      if (courseToShow.index[0] && courseToShow.index[0].lessons[0]) {
          handleLessonClick(0, 0);
      }
    }
  }, [values]);

  const fetchMedia = async (lesson, pageToken = null) => {
    setIsMediaLoading(true);
    try {
      const mediaResponse = await axios.post('http://localhost:5000/courses/generate-lesson-media', {
        lessonTitle: lesson.title,
        topic: values.topic,
        format: values.format,
        pageToken: pageToken
      });
      
      // Update the lesson with the new media details
      const updatedLesson = { 
          ...lesson, 
          ...mediaResponse.data 
      };
      
      // Update the main course state in an immutable way
      setCourse(currentCourse => {
        const newCourse = JSON.parse(JSON.stringify(currentCourse));
        const { subTopicIndex, lessonIndex } = findLessonIndices(lesson.title, newCourse);
        if (subTopicIndex !== -1) {
          newCourse.index[subTopicIndex].lessons[lessonIndex] = updatedLesson;
        }
        return newCourse;
      });

    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  const handleLessonClick = async (subTopicIndex, lessonIndex) => {
    setActiveLessonIndices({ subTopicIndex, lessonIndex });
    
    // Use a functional update to get the most recent course state
    setCourse(currentCourse => {
        const lesson = currentCourse.index[subTopicIndex].lessons[lessonIndex];
        if (lesson.content) return currentCourse; // No need to fetch if content exists

        setIsTextLoading(true);
        axios.post('http://localhost:5000/courses/generate-lesson-content', {
            lessonTitle: lesson.title,
            topic: values.topic,
            language: values.language
        }).then(textResponse => {
            const lessonWithText = { ...lesson, content: textResponse.data.content, isCompleted: true };
            
            const newCourse = JSON.parse(JSON.stringify(currentCourse));
            newCourse.index[subTopicIndex].lessons[lessonIndex] = lessonWithText;
            setCourse(newCourse);
            setIsTextLoading(false);
            fetchMedia(lessonWithText);

        }).catch(err => {
            console.error(`Failed to generate content for "${lesson.title}".`, err);
            setIsTextLoading(false);
        });

        return currentCourse; // Return original state while async operation runs
    });
  };
  
  const findLessonIndices = (lessonTitle, courseState) => {
      for (let i = 0; i < courseState.index.length; i++) {
          for (let j = 0; j < courseState.index[i].lessons.length; j++) {
              if (courseState.index[i].lessons[j].title === lessonTitle) {
                  return { subTopicIndex: i, lessonIndex: j };
              }
          }
      }
      return { subTopicIndex: -1, lessonIndex: -1 };
  };

  const handleStartQuiz = async () => {
    setIsQuizLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/courses/generate-quiz', {
        courseContext: course
      });
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setQuizData(response.data);
      } else {
        alert("The AI couldn't create a quiz for this topic. Please try generating more content.");
      }
    } catch (error) {
      alert("Sorry, we couldn't generate the quiz right now. Please try again later.");
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleQuizComplete = (finalScore) => {
    setQuizData(null);
    setQuizResult({ score: finalScore, total: quizData.length });
  };

  const handleCloseResults = () => {
    setQuizResult(null);
  };

  const handleExportPDF = async () => {
    setShowPdfModal(false);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(course.topic, 105, 150, { align: 'center' });
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Table of Contents", 14, 22);
    const tocBody = course.index.flatMap(subtopic => [
        [{ content: subtopic.title, colSpan: 2, styles: { fontStyle: 'bold' } }],
        ...subtopic.lessons.map(lesson => ['', lesson.title])
    ]);
    doc.autoTable({ startY: 30, head: [['Subtopic', 'Lesson']], body: tocBody, theme: 'grid' });
    const completedLessons = course.index.flatMap(st => st.lessons.filter(l => l.isCompleted));
    for (const lesson of completedLessons) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text(lesson.title, 14, 22);
        if (lesson.imageUrl) {
            try {
                const response = await fetch(lesson.imageUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onload = (e) => {
                        doc.addImage(e.target.result, 'JPEG', 15, 40, 180, 101);
                        resolve();
                    };
                    reader.readAsDataURL(blob);
                });
            } catch (e) { console.error("Could not add image to PDF", e); }
        }
        if (lesson.videoUrl) {
            doc.setTextColor(40, 128, 185);
            doc.textWithLink('Link to Video', 15, 40, { url: lesson.videoUrl.replace('embed/', 'watch?v=') });
            doc.setTextColor(0, 0, 0);
        }
        const splitText = doc.splitTextToSize(lesson.content || "No content generated.", 180);
        doc.setFontSize(12);
        doc.text(splitText, 14, lesson.imageUrl ? 150 : 60);
    }
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        const text = "This course was generated using ";
        const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const linkText = "SeekMYCOURSE";
        const linkWidth = doc.getStringUnitWidth(linkText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const totalWidth = textWidth + linkWidth;
        const startX = (doc.internal.pageSize.getWidth() - totalWidth) / 2;
        doc.text(text, startX, 285);
        doc.setTextColor(40, 128, 185);
        doc.textWithLink(linkText, startX + textWidth, 285, { url: 'https://seekmycourse.com' });
        doc.setTextColor(0, 0, 0);
    }
    doc.save(`${course.topic}.pdf`);
  };
  
  // Derive the active lesson directly from the state
  const activeLesson = (course && activeLessonIndices) ? course.index[activeLessonIndices.subTopicIndex].lessons[activeLessonIndices.lessonIndex] : null;

  if (!course) {
    return <Preloader text="Assembling knowledge, one byte at a time..." />;
  }

  if (quizResult) {
    return <QuizResult score={quizResult.score} totalQuestions={quizResult.total} onRetake={handleStartQuiz} onFinish={handleCloseResults} />;
  }

  if (quizData) {
    return <Quiz quizData={quizData} courseTopic={course.topic} onQuizComplete={handleQuizComplete} onClose={() => setQuizData(null)} />;
  }

  return (
    <>
      {(isTextLoading || isQuizLoading) && <Preloader text={isQuizLoading ? "Generating your quiz..." : "Assembling knowledge..."} />}
      {showPdfModal && (
        <ConfirmationModal
          message="The PDF will only contain content for the lessons you have already generated. Do you want to continue?"
          onConfirm={handleExportPDF}
          onCancel={() => setShowPdfModal(false)}
        />
      )}
      <div className="course-view-wrapper">
        <aside className="course-view-sidebar">
          <a href="#" onClick={goToHome} className="back-to-home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to home
          </a>
          <div className="sidebar-action" onClick={() => setShowPdfModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            Export as PDF
          </div>
          <div className="course-index-list">
            {course.index.map((subTopic, sIndex) => (
              <div key={sIndex}>
                <div className="subtopic-header">{subTopic.title}</div>
                {subTopic.lessons.map((lesson, lIndex) => (
                  <div 
                    key={lIndex} 
                    className={`lesson-item ${activeLesson && activeLesson.title === lesson.title ? 'active' : ''}`}
                    onClick={() => handleLessonClick(sIndex, lIndex)}
                  >
                    {lesson.title}
                    {lesson.isCompleted && <span style={{color: 'var(--primary-neon)'}}>✔</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-action" onClick={handleStartQuiz}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            Start Quiz
          </div>
        </aside>
        <main className="course-view-content">
          {activeLesson ? (
            <>
              <h2>{course.topic}</h2>
              <div className="lesson-media">
                {isMediaLoading ? (
                  <MediaPreloader text="Finding the best media for you..." />
                ) : (
                  <>
                    {activeLesson.videoUrl && <iframe key={activeLesson.videoUrl} width="100%" height="100%" src={activeLesson.videoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ borderRadius: '12px' }}></iframe>}
                    {activeLesson.imageUrl && <img src={activeLesson.imageUrl} alt={`Image for ${activeLesson.title}`} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />}
                  </>
                )}
              </div>
              <div className="media-actions">
                {activeLesson.channelTitle && <div className="video-credit">Video credit: <a href={activeLesson.channelUrl} target="_blank" rel="noopener noreferrer">{activeLesson.channelTitle}</a></div>}
                {values.format === 'Video and Theory' && (
                  <div className="media-buttons">
                    <button className="change-video-btn" onClick={() => fetchMedia(activeLesson, activeLesson.prevPageToken)} disabled={isMediaLoading || !activeLesson.prevPageToken}>&lt; Prev</button>
                    <button className="change-video-btn" onClick={() => fetchMedia(activeLesson, activeLesson.nextPageToken)} disabled={isMediaLoading || !activeLesson.nextPageToken}>Next Video &gt;</button>
                  </div>
                )}
              </div>
              <div className="lesson-text">
                <h3>{activeLesson.title}</h3>
                {activeLesson.isLoading ? <p>Generating text...</p> : <p>{activeLesson.content}</p>}
              </div>
            </>
          ) : (
            <p>Select a lesson to begin.</p>
          )}
        </main>
      </div>
      <Chatbot courseTopic={course.topic} courseContext={course} />
    </>
  );
};

export default Step9_Generate;
