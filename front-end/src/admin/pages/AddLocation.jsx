import React, { useState } from "react";
import axios from "axios";
import AdminSidebar from "../component/AdminSidebar";
import "../css/Addlocation.css";
import ButtonLoader from "../../components/ButtonLoader";
import { toast } from "react-toastify";

function Addlocation() {
  const [adlocation, setAdlocation] = useState("");
  const [buttonloading, setButtonloading] = useState(false);

  const handleChange = (e) => {
    const input = e.target.value;
    const capital = input.charAt(0).toUpperCase() + input.slice(1);
    setAdlocation(capital);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setButtonloading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/locations/add`,
        {
          city: adlocation,
        }
      );

      if (response.status === 201) {
        toast.success("location added successfully.");
        setAdlocation("");
      } else {
        toast.error("unexpected response. Try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("location already exist");
      } else {
        console.log("error submmitting location:", error);
        toast.error("something went wrong adding location try again");
      }
    } finally {
      setButtonloading(false);
    }
  };

  return (
    <>
      <AdminSidebar />
      <div className="h1-topbar">
        <h1>Add Location</h1>
      </div>
      <div className="locationadd-container">
        <form onSubmit={handlesubmit}>
          <input
            id="location-input"
            className="locationadd-name"
            type="text"
            placeholder="Location"
            value={adlocation}
            onChange={handleChange}
            required
          />{" "}
          <br />
          <ButtonLoader
            loading={buttonloading}
            type="submit"
            className="submit-loc"
          >
            Add Loc
          </ButtonLoader>
        </form>
      </div>
    </>
  );
}

export default Addlocation;
