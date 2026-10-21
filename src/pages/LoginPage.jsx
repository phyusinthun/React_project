
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { verifyAccount } from '../utils/auth';
import { PasswordInput } from '../components/PasswordInput';

export const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState(() =>
    location.state?.email ||
    localStorage.getItem('saved_login_email') ||
    ''
  );

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const account = await verifyAccount({ email, password });

      localStorage.setItem('saved_login_email', account.email);

      login(account);
      navigate('/');
    } catch (loginError) {
      setError(
        loginError.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <p className="auth-label">WELCOME TO Your little Store</p>
        <h1>Sign in</h1>

        <p className="auth-message">
          Sign in to continue your shopping journey.
        </p>

        <form onSubmit={handleLogin}>
          {error && (
            <p className="auth-error" role="alert">{error}</p>
          )}

          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              name="username"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in →'}
          </button>
        </form>

        <div className="auth-signup">
          <span>Don't have an account?</span>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};
