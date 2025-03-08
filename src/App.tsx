import React, { useState } from "react";
import UserTable from "./UserTable";
import DocumentTable from "./DocumentTable";
import "./App.css"; // Add some basic styling

function App() {
  const [activeTable, setActiveTable] = useState<"users" | "documents">("users");

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <button
          onClick={() => setActiveTable("users")}
          className={activeTable === "users" ? "active" : ""}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTable("documents")}
          className={activeTable === "documents" ? "active" : ""}
        >
          Documents
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTable === "users" && <UserTable />}
        {activeTable === "documents" && <DocumentTable />}
      </div>
    </div>
  );
}

export default App;
