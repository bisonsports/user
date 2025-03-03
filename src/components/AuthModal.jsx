import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isFlipping, setIsFlipping] = useState(false);

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="auth-modal-content">
          {/* Left side - Image (only visible on desktop) */}
          <div className="auth-modal-image">
            <img src="/auth-image.jpg" alt="Authentication" />
          </div>

          {/* Right side - Login/Signup Forms */}
          <div className="auth-modal-forms">
            <div className="auth-tabs">
              <button 
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                Login
              </button>
              <button 
                className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabChange('signup')}
              >
                Sign Up
              </button>
            </div>

            <div className="auth-form-container">
              <div className={`form-wrapper ${activeTab === 'login' ? 'login-active' : 'signup-active'}`}>
                <form className="auth-form login-form">
                  <div className="form-group">
                    <input type="email" placeholder="Email" required />
                  </div>
                  <div className="form-group">
                    <input type="password" placeholder="Password" required />
                  </div>
                  <button type="submit" className="submit-button">Login</button>
                  <div className="form-footer">
                    <a href="#">Forgot Password?</a>
                  </div>
                </form>

                <form className="auth-form signup-form">
                  <div className="form-group">
                    <input type="text" placeholder="Full Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Email" required />
                  </div>
                  <div className="form-group">
                    <input type="password" placeholder="Password" required />
                  </div>
                  <div className="form-group">
                    <input type="password" placeholder="Confirm Password" required />
                  </div>
                  <button type="submit" className="submit-button">Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 