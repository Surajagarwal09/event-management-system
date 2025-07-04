import React, { useState } from "react";
import axios from "axios";
import AdminSidebar from "../component/AdminSidebar";
import "../css/Addlocation.css";

function Addlocation() {
  const [adlocation, setAdlocation] = useState("");

  const handleChange = (e) => {
    const input = e.target.value;
    const capital = input.charAt(0).toUpperCase() + input.slice(1);
    setAdlocation(capital);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/locations/add",
        {
          city: adlocation,
        }
      );

      if (response.status === 201) {
        alert("location added successfully.");
        setAdlocation("");
      } else {
        alert("unexpected response. Try again.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("location already exist");
      } else {
        console.log("error submmitting location:", error);
        alert("something went wrong adding location try again");
      }
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
          <button type="submit" className="submit-loc">
            Add Loc
          </button>
        </form>
      </div>
    </>
  );
}

export default Addlocation;
