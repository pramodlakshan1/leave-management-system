import React, { useState, useEffect } from "react";
import Login from "./pages/loging";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    
    console.log("Saved token:", savedToken);
    console.log("Saved role:", savedRole);
    console.log("Condition !token || !role:", !token || !role);
    
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  // Debug log on every render
  console.log("Current render - Token:", token, "Role:", role);
  console.log("Show login?", !token || !role);

  if (!token || !role) {
    return <Login setToken={setToken} setRole={setRole} />;
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container">
        <div className="py-3">
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => {
              localStorage.clear();
              setToken(null);
              setRole(null);
            }}
          >
            Logout
          </button>
        </div>
        {role === "employee" ? (
          <EmployeeDashboard token={token} />
        ) : (
          <AdminDashboard token={token} />
        )}
      </div>
    </div>
  );
}

export default App;