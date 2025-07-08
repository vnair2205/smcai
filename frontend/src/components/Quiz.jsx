import React, { useState } from 'react';
import './Quiz.css';

const Quiz = ({ quizData, courseTopic, onQuizComplete, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onQuizComplete(score);
    }
  };

  const getButtonClass = (option) => {
    if (!isAnswered) return '';
    if (option === currentQuestion.correctAnswer) return 'correct';
    if (option === selectedAnswer) return 'incorrect';
    return '';
  };

  return (
    <div className="quiz-overlay">
      <button onClick={onClose} className="quiz-close-btn">&times;</button>
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>{courseTopic} Quiz</h1>
          <div className="quiz-progress">
            Question {currentQuestionIndex + 1} of {quizData.length}
          </div>
        </div>
        <div className="quiz-body">
          <h2>{currentQuestion.question}</h2>
          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${getButtonClass(option)}`}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="quiz-footer">
          {isAnswered && (
            <button className="next-btn" onClick={handleNextQuestion}>
              {currentQuestionIndex < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;