import React, { useState } from "react";
import "../../css/LoginRegistration.css";
import { useAdmin } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullScreenLoader from "../../components/FullscreenLoader";
import { toast } from "react-toastify";

function AdminLogin({ onClose, openSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/login`,
        { email, password }
      );
      const { token, admin } = response.data;
      login(token, admin.fullname);
      setTimeout(() => {
        onClose();
        navigate("/admin/dashboard", { replace: true });
        toast.success("Login successfull");
      }, 800);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid email or Password ");
      } else if (error.response?.status === 404) {
        toast.error("User not found!");
      } else {
        toast.error("Something went wrong. Try again.");
      }
      console.log(error);
    } finally {
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
