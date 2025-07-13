import React, { useState } from "react";
import "../css/LoginRegistration.css";
import axios from "axios";
import { useUser } from "../context/UserContext";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";

function LoginRegistration({ onClose, openSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const [buttonloading, setButtonloading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonloading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      login(token, user.fullname);
      toast.success("Login successful");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid email or password");
      } else if (error.response?.status === 404) {
        toast.error("User not found!");
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } finally {
      setButtonloading(false);
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
            <ButtonLoader
              loading={buttonloading}
              type="submit"
              className="login-btn"
            >
              Login
            </ButtonLoader>
          </div>

          <div className="signup-link">
            <button type="button" onClick={openSignup}>
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegistration;
