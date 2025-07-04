import React, { useState } from "react";
import "../../css/LoginRegistration.css";
import { useAdmin } from "../../context/AdminContext";
import axios from "axios";

function AdminLogin({ onClose,openSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password }
      );

      const { token, admin } = response.data;
      login(token, admin.fullname)

      alert("Admin login successful");
      onClose();
      window.location.href = "/admin/dashboard";
    } catch (error) {
      setError("Invalid email or password");
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-header">
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={handleAdminLogin}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          {error && <p className="error-message">{error}</p>}

          <div className="logsubmit-btn">
            <button type="submit">Login</button>
          </div>
          <div className="signup-link">
            <button onClick={openSignup}>Don't have an account? Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
