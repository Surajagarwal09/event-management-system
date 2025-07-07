import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../css/UserRegistration.css";
import FullScreenLoader from "../../components/FullscreenLoader";

function UserRegistration() {
  const { userId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/registrations`
        );
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [userId]);

  const handleEventdetails = (reg) => {
    navigate(`/admin/events/details/${reg.eventId}`);
  };

  return (
    <div className="admin-events">
      <AdminSidebar />
      {loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="flex-prev">
            <button
              className="prev-button"
              onClick={() => {
                navigate(-1);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1 className="registration-title">User's Registered Events</h1>
          </div>
          <div className="user-registration-container">
            <table className="user-registration-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th className="eventon-th">Event on</th>
                  <th className="bookedon">SignedUp</th>
                  <th className="location-th">Location</th>
                  <th>Event ID</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map((reg, idx) => (
                    <tr key={idx} onClick={() => handleEventdetails(reg)}>
                      <td data-label="Event Name">{reg.eventName}</td>
                      <td className="eventon-td" data-label="Event Date">
                        {new Date(reg.eventDate).toLocaleDateString()}
                      </td>
                      <td data-label="Booked Date">
                        {new Date(reg.bookedDate).toLocaleDateString()}
                      </td>
                      <td className="location-td" data-label="Location">
                        {reg.location}
                      </td>
                      <td data-label="Event ID">{reg.eventId}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default UserRegistration;
