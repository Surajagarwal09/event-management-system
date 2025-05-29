import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import "../css/UserRegistration.css";

function UserRegistration() {
  const { userId } = useParams();
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/${userId}/registrations`
        );
        setRegistrations(res.data);
      } catch (err) {
        console.error("Failed to fetch registrations:", err);
      }
    };

    fetchRegistrations();
  }, [userId]);

  return (
    <div className="admin-events">
      <AdminSidebar />
      <div className="user-registration-container">
        <h1 className="registration-title">User's Registered Events</h1>
        <table className="user-registration-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Date</th>
              <th>Booked Date</th>
              <th>Location</th>
              <th>Event ID</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map((reg, idx) => (
                <tr key={idx}>
                  <td data-label="Event Name">{reg.eventName}</td>
                  <td data-label="Event Date">
                    {new Date(reg.eventDate).toLocaleDateString()}
                  </td>
                  <td data-label="Booked Date">
                    {new Date(reg.bookedDate).toLocaleDateString()}
                  </td>
                  <td data-label="Location">{reg.location}</td>
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
    </div>
  );
}

export default UserRegistration;
