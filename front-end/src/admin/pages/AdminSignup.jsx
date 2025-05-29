import React, { useState } from "react";
import "../../css/SignupRegistration.css";
import axios from "axios";

function AdminSignup({ onClose, openLoginModal }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneno: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/signup",
        formData
      );
      setSuccess("Admin registration successful");
      setError("");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      setError(error.response?.data.message || "Signup failed. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className="sregistration">
      <div className="sregistration-form">
        <div className="sreg-header">
          <h2>Admin Sign Up</h2>
        </div>
        <form onSubmit={handleSignup}>
          <label htmlFor="fullname">Full Name:</label>
          <input
            id="fullname"
            type="text"
            required
            value={formData.fullname}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />

          <label htmlFor="phoneno">Phone No:</label>
          <input
            id="phoneno"
            type="text"
            inputMode="numeric"
            required
            value={formData.phoneno}
            onChange={handleChange}
            placeholder="123-456-7890"
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <div className="submit-btn">
            <button type="submit">Sign Up</button>
          </div>
          <div className="login-link">
            <button onClick={openLoginModal}>
              Already have an account?Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminSignup;
