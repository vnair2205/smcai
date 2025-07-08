import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';
import IntroBubble from './IntroBubble.jsx';

const Chatbot = ({ courseTopic, courseContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    // Create a unique key for each course topic
    const introKey = `hasSeenTanisiIntro_${courseTopic}`;
    const hasSeenIntroForCourse = localStorage.getItem(introKey);

    if (!hasSeenIntroForCourse) {
      // If not, show the intro bubble after a short delay
      const timer = setTimeout(() => {
        setShowIntro(true);
      }, 2000); // Show after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [courseTopic]); // <-- Dependency on courseTopic is crucial

  const handleIntroClose = () => {
    setShowIntro(false);
    // Mark the intro as seen for this specific course
    const introKey = `hasSeenTanisiIntro_${courseTopic}`;
    localStorage.setItem(introKey, 'true');
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          text: `Hey there! I'm TANISI, your AI teacher. If you have any questions about your "${courseTopic}" course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isOpen, messages.length, courseTopic]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = {
      text: userInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/courses/ask-tanisi', {
        question: userInput,
        courseContext: courseContext
      });

      const aiMessage = {
        text: response.data.answer,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        text: "Sorry, I'm having a little trouble connecting. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showIntro && <IntroBubble onClose={handleIntroClose} />}

      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h3>TANISI - Your AI Teacher</h3>
          <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
        </div>
        <div className="chatbot-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          {isLoading && <div className="typing-indicator"><span></span><span></span><span></span></div>}
        </div>
        <div className="chatbot-footer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              placeholder="Ask me anything about the course..."
              autoComplete="off"
            />
            <button type="submit" disabled={isLoading}>Send</button>
          </form>
        </div>
      </div>

      <div className="chat-icon-container" onClick={() => setIsOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
    </>
  );
};

export default Chatbot;