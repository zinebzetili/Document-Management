import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="w-full h-screen flex">
        {/* Left half of the screen - background styling */}
        <div className="w-1/2 h-full flex flex-col bg-[#282c34] items-center justify-center">
        </div>

        {/* Right half of the screen - login form */}
        <div className="w-1/2 h-full bg-[#1a1a1a] flex flex-col p-20 justify-center">
            <div className="w-full flex flex-col max-w-[450px] mx-auto">
                {/* Header section with title and welcome message */}
                <div className="w-full flex flex-col mb-10 text-white">
                    <h3 className="text-4xl font-bold mb-2">Login</h3>
                    <p className="text-lg mb-4">Welcome Back! Please enter your details.</p>
                </div>

                {/* Input fields for email and password */}
                <form onSubmit={handleLogin} className="w-full flex flex-col mb-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    {/* Button to log in with email and password */}
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-4">
                        Log In
                    </button>
                </form>

                {/* Display error message if there is one */}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                {/* Divider with 'OR' text */}
                <div className="w-full flex items-center justify-center relative py-4">
                    <div className="w-full h-[1px] bg-gray-500"></div>
                    <p className="text-lg absolute text-gray-500 bg-[#1a1a1a] px-2">OR</p>
                </div>

                {/* Simulated Google login button (No Firebase) */}
                <button
                    className="w-full bg-white text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer mt-7">
                    Log In With Google
                </button>
            </div>

            {/* Link to sign up page */}
            <div className="w-full flex items-center justify-center mt-10">
                <p className="text-sm font-normal text-gray-400">Don't have an account?  
                    <span className="font-semibold text-white cursor-pointer underline">
                        <a href="/signup">Sign Up</a>
                    </span>
                </p>
            </div>
        </div>
    </div>
);
};

export default Login;
