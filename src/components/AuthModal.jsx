import React, { useState, useRef, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AuthModal.css';
import googleIcon from '../assets/images/google-icon.png';
import sportsFacility from '../assets/images/sports-facility.jpg';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [isFlipping, setIsFlipping] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNo: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/wrong-password':
        return 'Invalid password';
      case 'auth/user-not-found':
        return 'Invalid email.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please try logging in.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  };

  if (!isOpen) return null;

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        mobileNo: formData.mobileNo,
        createdAt: new Date().toISOString()
      });

      onAuthSuccess(userCredential.user);
      onClose(); // Close modal after successful signup
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      onAuthSuccess(userCredential.user);
      onClose(); // Close modal after successful login
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleMobileSubmit = async () => {
    if (!mobileNumber.trim()) {
      setError('Please enter your mobile number');
      return;
    }

    try {
      // Update the user document with mobile number
      await setDoc(doc(db, 'users', googleUser.uid), {
        name: googleUser.displayName,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        mobileNo: mobileNumber,
        createdAt: new Date().toISOString()
      }, { merge: true }); // Use merge to preserve existing data

      onAuthSuccess(googleUser);
      setShowMobileModal(false); // Close the mobile modal
      onClose(); // Close the main auth modal
    } catch (error) {
      setError('Failed to save mobile number. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // If new user, show mobile number collection modal
        setGoogleUser(result.user);
        setShowMobileModal(true);
      } else {
        const userData = userDoc.data();
        if (!userData.mobileNo) {
          // If user exists but has no mobile number, show mobile number collection modal
          setGoogleUser(result.user);
          setShowMobileModal(true);
        } else {
          // If user exists with mobile number, proceed with login
          onAuthSuccess(result.user);
          onClose();
        }
      }
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setResetEmail('');
        setResetSuccess(false);
      }, 3000);
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-modal-overlay">
        <div className="auth-modal" ref={modalRef}>
          <button className="close-button" onClick={onClose}>×</button>
          
          <div className="auth-modal-content">
            {/* Left side - Image (only visible on desktop) */}
            <div className="auth-modal-image">
              <img src={sportsFacility} alt="Sports Facility" />
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

              {error && <div className="error-message">{error}</div>}

              <div className="auth-form-container">
                <div className={`form-wrapper ${activeTab === 'login' ? 'login-active' : 'signup-active'}`}>
                  <form className="auth-form login-form" onSubmit={handleLogin} autoComplete="on">
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="form-group remember-me">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                        />
                        <span>Remember me</span>
                      </label>
                    </div>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Login'}
                    </button>
                    <div className="form-footer">
                      <button 
                        type="button" 
                        className="forgot-password-link"
                        onClick={() => setShowForgotPasswordModal(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="divider">
                      <span>or</span>
                    </div>
                    <button 
                      type="button" 
                      className="google-sign-in-button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <img src={googleIcon} alt="Google" />
                      Continue with Google
                    </button>
                  </form>

                  <form className="auth-form signup-form" onSubmit={handleSignup} autoComplete="on">
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                        autoComplete="name"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="tel" 
                        name="mobileNo"
                        placeholder="Mobile Number" 
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        required 
                        autoComplete="tel"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        required 
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required 
                        autoComplete="new-password"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                    <div className="divider">
                      <span>or</span>
                    </div>
                    <button 
                      type="button" 
                      className="google-sign-in-button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <img src={googleIcon} alt="Google" />
                      Continue with Google
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Number Collection Modal */}
      {showMobileModal && (
        <div className="auth-modal-overlay">
          <div className="mobile-modal">
            <h2>Complete Your Profile</h2>
            <p>Please enter your mobile number to continue</p>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                autoComplete="tel"
                pattern="[0-9]{10}"
              />
            </div>
            <button 
              className="submit-button"
              onClick={handleMobileSubmit}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="auth-modal-overlay">
          <div className="mobile-modal">
            <button className="close-button" onClick={() => setShowForgotPasswordModal(false)}>×</button>
            <h2>Reset Password</h2>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            {error && <div className="error-message">{error}</div>}
            {resetSuccess && (
              <div className="success-message">
                Password reset link sent! Please check your email.
              </div>
            )}
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal; 