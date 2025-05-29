import React from "react";
import "../css/SignupRegistration.css";
import axios from "axios";
import { useState } from "react";

function SignupRegistration({ onClose, openLoginModal }) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    dob: "",
    phoneno: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
     e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        formData
      );
      setSuccess("Registration successful");
      setError("");
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      setError(error.response?.data.message || "Signup failed. Try again.");
      setSuccess("");
      console.log(error);
    }
  };

  return (
    <div className="sregistration">
      <div className="sregistration-form">
        <div className="sreg-header">
          <div>
            <h2>Sign Up</h2>
          </div>
        </div>
        <form onSubmit={handleSignup}>
          <label htmlFor="fullname">Full Name:</label>
          <input
            id="fullname"
            type="text"
            required
            value={formData.fullname}
            onChange={handlechange}
            placeholder="Full Name"
          />

          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={handlechange}
            placeholder="forexample@gmail.com"
          />

          <label htmlFor="dob">Date of Birth:</label>
          <input
            id="dob"
            type="date"
            required
            value={formData.dob}
            onChange={handlechange}
          />

          <label htmlFor="phoneno">Phone No:</label>
          <input
            id="phoneno"
            type="text"
            inputMode="numeric"
            required
            value={formData.phoneno}
            onChange={handlechange}
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

export default SignupRegistration;
