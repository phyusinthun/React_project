import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAccount } from '../utils/auth';
import { PasswordInput } from '../components/PasswordInput';

export const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const account = await registerAccount({
        name,
        email,
        password
      });

      localStorage.setItem('saved_login_email', account.email);

      navigate('/login', {
        state: { email: account.email }
      });
    } catch (signupError) {
      setError(
        signupError.message ||
        'Unable to create your account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <p className="auth-label">JOIN YOUR LITTLE STORE</p>
        <h1>Create account</h1>

        <p className="auth-message">
          Create an account and start your shopping journey.
        </p>

        <form onSubmit={handleSignup}>
          {error && (
            <p className="auth-error" role="alert">{error}</p>
          )}

          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
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
            <label htmlFor="signup-password">Password</label>
            <PasswordInput
              id="signup-password"
              name="new-password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              minLength={8}
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
            {isSubmitting ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <div className="auth-signup">
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
