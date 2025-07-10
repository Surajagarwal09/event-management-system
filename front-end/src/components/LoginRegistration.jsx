import React, { useState } from "react";
import "../css/LoginRegistration.css";
import axios from "axios";
import { useUser } from "../context/UserContext";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";

function LoginRegistration({ onClose, openSignup }) {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const { login } = useUser();
  const [buttonloading, setButtonloading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        { email, dob }
      );
      const { token, user } = response.data;
      login(token, user.fullname);
      toast.success("Login successfull");
      setTimeout(() => {
        onClose();
      },800);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid email or date of birth");
      } else if (error.response?.status === 404) {
        toast.error("User not found!");
      } else {
        toast.error("Something went wrong. Try again.");
      }
      console.log(error);
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

          <label htmlFor="dob">Date of Birth:</label>
          <input
            id="dob"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
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
            <button onClick={openSignup}>Don't have an account? Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginRegistration;
