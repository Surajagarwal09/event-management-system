import React, { useState } from "react";
import "../../css/LoginRegistration.css";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../../components/FullscreenLoader";
function AdminLogin({ onClose, openSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        { email, password }
      );
      const { token, admin } = response.data;
      login(token, admin.fullname);
      onClose();
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setError("Invalid email or password");
      console.log(error);
      setLoading(false);
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
            {loading && <FullScreenLoader />}
            <button onClick={openSignup}>Don't have an account? Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
