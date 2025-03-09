import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './authSlice'; // Import the logout action
import UserTable from './UserTable';
import DocumentTable from './DocumentTable';
import './App.css'; // Import the CSS file

function App() {
  const [activeTable, setActiveTable] = useState<'users' | 'documents'>('users');
  const dispatch = useDispatch();

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the logout action
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button
          onClick={() => setActiveTable('users')}
          className={activeTable === 'users' ? 'active' : ''}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTable('documents')}
          className={activeTable === 'documents' ? 'active' : ''}
        >
          Documents
        </button>

        {/* Logout button at the bottom of the sidebar */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTable === 'users' && <UserTable />}
        {activeTable === 'documents' && <DocumentTable />}
      </div>
    </div>
  );
}

export default App;
