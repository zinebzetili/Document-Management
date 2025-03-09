import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from './authSlice'; // Import the login action
import axios from 'axios'; // Import axios for API calls
import './Login.css'; // Import the CSS file

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State variables for managing email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Fetch users from the API
      const response = await axios.get('http://localhost:3001/users');
      const users = response.data;

      // Find the user with the matching email
      const user = users.find((u: any) => u.email === email);

      if (user) {
        // Simulate password validation (since we don't have passwords in the API)
        // For now, assume the password is "password" for all users
        if (password === 'password') {
          dispatch(login({ email: user.email, name: user.name })); // Dispatch the login action
          navigate('/dashboard'); // Redirect to the dashboard
        } else {
          setError('Invalid password.');
        }
      } else {
        setError('User not found.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      {/* Left half of the screen - background styling */}
      <div className="login-left">
        <div className="welcome-message">
          <h1>Welcome Back</h1>
        </div>
      </div>

      {/* Right half of the screen - login form */}
      <div className="login-right">
        <div className="login-form">
          {/* Header section with title and welcome message */}
          <div className="login-header">
            <h3>Login</h3>
            <p>Welcome Back! Please enter your details.</p>
          </div>

          {/* Input fields for email and password */}
          <form onSubmit={handleLogin} className="login-inputs">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Button to log in with email and password */}
            <button type="submit">Log In</button>
          </form>

          {/* Display error message if there is one */}
          {error && <div className="error-message">{error}</div>}

          {/* Divider with 'OR' text */}
          <div className="divider">
            <div className="divider-line"></div>
            <p>OR</p>
          </div>

          {/* Simulated Google login button */}
          <button className="google-login">Log In With Google</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
