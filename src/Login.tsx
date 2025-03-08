import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const navigate = useNavigate();
    
    // State variables for managing email, password, and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle form submission
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate login (you can replace this with actual authentication logic)
        if (email === "test@example.com" && password === "password") {
            navigate('/dashboard');
        } else {
            setError("Invalid email or password.");
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

                    {/* Simulated Google login button (No Firebase) */}
                    <button className="google-login">Log In With Google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
