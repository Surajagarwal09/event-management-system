import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/MyRegistrations.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function MyRegistrations() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to view your registrations.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const registeredEvents = response.data.user.registeredEvents || [];

        const sortedEvents = registeredEvents.sort((a, b) => {
          const isAEnded = new Date(a.eventDate) < new Date();
          const isBEnded = new Date(b.eventDate) < new Date();

          if (isAEnded && !isBEnded) return 1;
          if (isAEnded && isBEnded) return -1;
          return new Date(b.bookedDate) - new Date();
        });

        setEvents(sortedEvents);

      } catch (error) {
        console.error("Failed to fetch user details:", error);
        alert("Unable to load registrations.");
      }
    };

    fetchUserRegistrations();
  }, []);

  const getEventStatus = (eventDate) => {
    const today = new Date();
    const event = new Date(eventDate);
    return event < today ? "Ended" : "Confirmed";
  };

  const handleCancel = async (eventId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to cancel the registration.");
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id;

    await axios.post(
      `http://localhost:5000/api/events/${eventId}/cancel`,
      { userId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.eventId !== eventId)
    );
    alert("Event cancelled successfully.");
  } catch (error) {
    console.error("Cancellation failed:", error);
    alert(error.response?.data?.message || "Failed to cancel event.");
  }
};

  return (
    <div>
      <Navbar />
      <div className="myregistration">
        <div className="myregister-header">
          <h1>Registered Events</h1>
        </div>
        <div className="myreg-list">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div key={index} className="myregistration-card">
                <h2>{event.eventName}</h2>
                <div className="myreg-details">
                  <p><b>Booked On:</b> {new Date(event.bookedDate).toLocaleDateString()}</p>
                  <p><b>Date:</b> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p><b>Location:</b> {event.location}</p>
                  <p className={getEventStatus(event.eventDate)==="Ended"?"status-ended":"status-confirmed"}>
                    <b>Status:</b> {getEventStatus(event.eventDate)}
                  </p>
                  {getEventStatus(event.eventDate) === "Confirmed" && (
                    <button
                      className="cancel-event"
                      onClick={() => handleCancel(event.eventId)}
                    >
                      Cancel Event <FontAwesomeIcon icon={faXmark} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-event">No events registered yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRegistrations;
