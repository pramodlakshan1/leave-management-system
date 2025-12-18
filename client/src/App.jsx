import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/loging";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/adminDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  if (!token) {
    return <Login setToken={setToken} setRole={setRole} />;
  }

  return (
    <Router>
      <Routes>
        {role === "admin" ? (
          <Route path="*" element={<AdminDashboard token={token} />} />
        ) : (
          <Route path="*" element={<EmployeeDashboard token={token} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
