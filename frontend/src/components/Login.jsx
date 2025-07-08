import React, { useState } from 'react';
import './Auth.css';
import logo from '../assets/SeekMYCOURSE_logo.png'; // Import the logo

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'vishnu@seekmycourse.com' && password === 'Vishnu@2205') {
      setError('');
      onLogin(true);
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-branding-section">
        <img src={logo} alt="SeekMYCOURSE Logo" />
      </div>
      <div className="auth-form-section">
        <div className="auth-form-container">
          <h2>Welcome Back!</h2>
          <p>Please enter your details to sign in.</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-options">
              <span>Forgot Password?</span>
            </div>
            <div className="button-group">
              <button type="submit" className="button-next">Sign In</button>
            </div>
          </form>
          <div className="auth-switch">
            Don't have an account? <span>Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
