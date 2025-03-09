// main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // Import the Redux store
import Login from './Login';
import App from './App';
import ProtectedRoute from './ProtectedRoute';

const Main: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<App />} />
        </Route>

        {/* Redirect all other paths to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container!); // Use non-null assertion (!) to ensure container is not null

// Render the app with Redux Provider
root.render(
  <Provider store={store}>
    <Main />
  </Provider>
);
