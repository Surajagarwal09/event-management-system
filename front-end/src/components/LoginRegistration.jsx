import React, { useState } from "react";
import "../css/LoginRegistration.css";
import axios from "axios";
import { useUser } from "../context/UserContext";

function LoginRegistration({ onClose, openSignup }) {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5000/api/users/login",
      { email, dob }
    );

    const { token, user } = response.data;
    login(token, user.fullname);

    alert("Login successful");
    onClose();
  } catch (error) {
    setError("Invalid email or date of birth");
    console.log(error);
  }
};

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-header">
          <h2>Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="forexample@gmail.com"
          />

          <label htmlFor="dob">Date of Birth:</label>
          <input
            id="dob"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
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

export default LoginRegistration;
