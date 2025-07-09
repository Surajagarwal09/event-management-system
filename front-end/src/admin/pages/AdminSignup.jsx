import React, { useState } from "react";
import "../../css/SignupRegistration.css";
import axios from "axios";
import ButtonLoader from "../../components/ButtonLoader";
import { toast } from "react-toastify";

function AdminSignup({ onClose, openLoginModal }) {
  const [buttonloading, setButtonloading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phoneno: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/signup",
        formData
      );
      toast.success("Registration successful");
      setTimeout(() => {
        openLoginModal();
      }, 800);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setButtonloading(false);
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

          <div className="submit-btn">
            <ButtonLoader
              loading={buttonloading}
              type="submit"
              className="admsignup-btn"
            >
              Sign Up
            </ButtonLoader>
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
