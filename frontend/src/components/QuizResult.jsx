import React from 'react';
import './QuizResult.css';

const QuizResult = ({ score, totalQuestions, onRetake, onFinish }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  let feedback = {
    title: '',
    message: ''
  };

  if (percentage >= 80) {
    feedback.title = "Excellent Work!";
    feedback.message = "You have a strong grasp of the material.";
  } else if (percentage >= 50) {
    feedback.title = "Good Job!";
    feedback.message = "You're on the right track. A little review could be helpful.";
  } else {
    feedback.title = "Time to Review!";
    feedback.message = "Don't worry, learning is a journey. Let's try that again.";
  }

  return (
    <div className="quiz-result-overlay">
      <div className="quiz-result-container">
        <h2>{feedback.title}</h2>
        <p className="score-text">Your Score</p>
        <div className="score-circle">
          <span className="score">{score}</span>
          <span className="total">/ {totalQuestions}</span>
        </div>
        <p className="feedback-message">{feedback.message}</p>
        <div className="result-actions">
          <button onClick={onRetake} className="button-back">Retake Quiz</button>
          <button onClick={onFinish} className="button-next">Back to Course</button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
