import { useState } from 'react';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Controlled Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setErrorMessage('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (activeTab === 'register' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    try {
      setLoading(true);
      const endpoint =
        activeTab === 'login'
          ? 'http://localhost:8081/api/auth/login'
          : 'http://localhost:8081/api/auth/register';

      const payload =
        activeTab === 'login'
          ? { email: trimmedEmail, password }
          : { name: name.trim(), email: trimmedEmail, password, phone: phone.trim() };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      // Success! Pass auth response to parent
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
      handleClose();
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to authentication service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-header">
          <span className="auth-badge">THE FOOTBALL VAULT</span>
          <h3 className="auth-title">
            {activeTab === 'login' ? 'Welcome Back, Fan' : 'Join The Football Vault'}
          </h3>
          <p className="auth-subtitle">
            {activeTab === 'login'
              ? 'Sign in to access your orders and express checkout.'
              : 'Create your account to unlock order tracking and matchday perks.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
            }}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="auth-error-banner">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name *</label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g., Rayan Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address *</label>
            <input
              id="auth-email"
              type="email"
              placeholder="e.g., fan@jersey4u.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-pwd">Password * (Min. 6 chars)</label>
            <input
              id="auth-pwd"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {activeTab === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-phone">Mobile Number (Optional)</label>
              <input
                id="auth-phone"
                type="tel"
                placeholder="10-digit WhatsApp number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'AUTHENTICATING...'
              : activeTab === 'login'
              ? 'SIGN IN TO VAULT ⚡'
              : 'CREATE VAULT ACCOUNT ⚡'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            🛡️ Secured with <strong>Spring Security 6 &amp; JWT</strong>. Passwords are salted and
            hashed with <strong>BCrypt</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
