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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/details`
        );
        setUser(res.data.user);
        console.log(res);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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
            <button className="prev-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h1 className="registration-title">User's Registered Events</h1>
          </div>

          {user && (
              <div className="useri-flex-box">
                <h2>User Details</h2>
              <div className="user-info-box">
                <p>
                  <strong>Full Name:</strong> {user.fullname}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phoneno || "N/A"}
                </p>
                <p>
                  <strong>Total Registered Events:</strong>{" "}
                  {user.registeredEvents.length}
                </p>
              </div>
            </div>
          )}

            <div className="user-registration-container">
              <h2>Registered Events</h2>
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
                {user?.registeredEvents.length > 0 ? (
                  user.registeredEvents.map((reg, idx) => (
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
