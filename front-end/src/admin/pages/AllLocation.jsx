import React, { useEffect, useState } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import "../css/AllLocation.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocationsStart,
  fetchLocationsSuccess,
  fetchLocationsFailure,
  deleteLocationSuccess,
} from "../../redux/LocationSlice";

function AllLocations() {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector((state) => state.locations);

  useEffect(() => {
    const fetchLocations = async () => {
      dispatch(fetchLocationsStart());
      try {
        const res = await axios.get(
          "http://localhost:5000/api/locations/cities"
        );
        dispatch(fetchLocationsSuccess(res.data.data));
      } catch (error) {
        dispatch(fetchLocationsFailure(error.message));
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, [dispatch]);

  const handleDelete = async (city) => {
    if (window.confirm(`Are you sure you want to delete "${city}"?`)) {
      try {
        await axios.delete(
          `http://localhost:5000/api/locations/delete/${city}`
        );
        dispatch(deleteLocationSuccess(city));
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
            {loading && (
              <tr>
                <td colSpan="2" className="location-empty">
                  Loading...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan="2" className="location-empty">
                  Error: {error}
                </td>
              </tr>
            )}

            {!loading && cities.length > 0
              ? cities.map((city, index) => (
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
              : !loading && (
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
