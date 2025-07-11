import "../css/SignupRegistration.css";
import axios from "axios";
import { useState } from "react";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";
import CustomDatePicker from "./Datepicker";

function SignupRegistration({ onClose, openLoginModal }) {
  const [buttonloading, setButtonloading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    dob: null, 
    phoneno: "",
  });

  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    try {
      const formattedDOB =
        formData.dob instanceof Date
          ? `${formData.dob.getFullYear()}-${String(
              formData.dob.getMonth() + 1
            ).padStart(2, "0")}-${String(formData.dob.getDate()).padStart(
              2,
              "0"
            )}`
          : formData.dob;

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/signup`,
        {
          ...formData,
          dob: formattedDOB,
        }
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
          <CustomDatePicker
            date={formData.dob}
            setDate={(selectedDate) =>
              setFormData((prev) => ({ ...prev, dob: selectedDate }))
            }
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

          <div className="submit-btn">
            <ButtonLoader
              loading={buttonloading}
              type="submit"
              className="signup-btn"
            >
              Sign Up
            </ButtonLoader>
          </div>

          <div className="login-link">
            <button onClick={openLoginModal}>
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupRegistration;
