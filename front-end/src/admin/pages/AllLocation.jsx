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
import FullScreenLoader from "../../components/FullscreenLoader";
import ButtonLoader from "../../components/ButtonLoader";
import Swal from "sweetalert2";

function AllLocations() {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector((state) => state.locations);
  const [deletingCity, setDeletingCity] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      dispatch(fetchLocationsStart());
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/locations/cities`
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
    setDeletingCity(city);

    const result = await Swal.fire({
      title: "Delete Location?",
      text: "Are you sure you want to Delete this Location?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        popup: "swal2-dark",
      },
    });

    if (!result.isConfirmed) {
      setDeletingCity(null);
      return;
    }
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/locations/delete/${city}`);
      dispatch(deleteLocationSuccess(city));
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingCity(null);
    }
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <FullScreenLoader />
      </>
    );
  }

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
            {error && (
              <tr>
                <td colSpan="2" className="location-empty">
                  Error: {error}
                </td>
              </tr>
            )}

            {cities.length > 0 ? (
              cities.map((city, index) => (
                <tr key={index}>
                  <td colSpan="2">
                    <div className="location-row-flex">
                      <p className="location-name-text">{city}</p>
                      <ButtonLoader
                        loading={deletingCity === city}
                        type="submit"
                        className="location-delete-button"
                        onClick={() => handleDelete(city)}
                      >
                        Delete
                      </ButtonLoader>
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
