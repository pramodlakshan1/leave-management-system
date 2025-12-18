import React, { useState } from "react";
import axios from "axios";

const Login = ({ setToken, setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      const decoded = JSON.parse(atob(token.split(".")[1]));

      setToken(token);
      setRole(decoded.role);

      localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);

    } catch (err) {
     const msg =
      err.response?.data?.msg ||
      err.response?.data?.errors?.[0]?.msg ||
      "Invalid email or password";
    setError(msg);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h4 className="mb-4 text-center">Login</h4>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
