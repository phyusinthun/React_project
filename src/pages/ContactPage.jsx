import React, { useState } from 'react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newMessage = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      submittedAt: new Date().toISOString(),
    };

    try {
      const savedMessages = localStorage.getItem('contactMessages');
      const messages = savedMessages ? JSON.parse(savedMessages) : [];

      if (!Array.isArray(messages)) {
        throw new Error('Saved contact messages are not an array.');
      }

      localStorage.setItem(
        'contactMessages',
        JSON.stringify([...messages, newMessage])
      );
      setSubmitted(true);
      setError('');
    } catch (saveError) {
      console.error('Failed to save contact message:', saveError);
      setError('Could not save your message. Please try again.');
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-left">

        <p className="contact-label">GET IN TOUCH</p>

        <h1>
          Let's talk.
        </h1>

        <p className="contact-intro">
          Have a question about our products or need some help? <br></br>
          We'd love to hear from you.
        </p>

        <div className="contact-line"></div>

        <div className="contact-info">

          <div>
            <span>Email ⌯⌲</span>
            <p>hello@yourlittlestore.com</p>
          </div>

          <div>
            <span>𝗙𝗼𝗹𝗹𝗼𝘄 Us જ⁀➴</span>
            <p>@yourlittlestore</p>
          </div>

        </div>

        <div className="contact-footer-text">
          <span>YOUR LITTLE STORE</span>
          <span>✦</span>
          <span>EST. 2026</span>
        </div>

      </div>


      <div className="contact-right">

        {!submitted ? (
          <form onSubmit={handleSubmit} className="contact-form">

            <div className="contact-field">
              <label htmlFor="contact-name">Your name</label>

              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">Email address</label>

              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Your message</label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="How can we help?"
                rows="5"
                required
              />
            </div>

            <button type="submit" className="contact-button">
              Send message →
            </button>

            {error && <p role="alert">{error}</p>}

          </form>
        ) : (
          <div className="contact-success">

            <span>✓</span>

            <h2>Message sent!</h2>

            <p>
              Thank you for getting in touch with us.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};