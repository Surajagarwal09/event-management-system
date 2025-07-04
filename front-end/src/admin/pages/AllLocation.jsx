import React, { useEffect, useState } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import "../css/AllLocation.css";

function AllLocations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/locations/cities"
        );
        setLocations(res.data.data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleDelete = async (city) => {
    if (window.confirm(`Are you sure you want to delete "${city}"?`)) {
      try {
        await axios.delete(
          `http://localhost:5000/api/locations/delete/${city}`
        );
        setLocations((prev) => prev.filter((loc) => loc !== city));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <>
      <AdminSidebar />
      <div className="location-title-bar">
        <h1>All Locations</h1>
      </div>
      <div className="location-table-container">
        <table className="location-table">
          <thead>
            <tr>
              <th className="location-name-th">Location</th>
            </tr>
          </thead>
          <tbody>
            {locations.length > 0 ? (
              locations.map((city, index) => (
                <tr key={index}>
                  <td colSpan="2">
                    <div className="location-row-flex">
                      <p className="location-name-text">{city}</p>
                      <button
                        className="location-delete-button"
                        onClick={() => handleDelete(city)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="location-empty">
                  No locations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllLocations;
