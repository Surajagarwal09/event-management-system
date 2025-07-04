import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/MyRegistrations.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faArrowDown,
  faArrowUp,
  faLocationDot,
  faCalendarDays,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function MyRegistrations() {
  const [events, setEvents] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to view your registrations.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const registeredEvents = response.data.user.registeredEvents || [];
        console.log(response);

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
                <div className="evenameflex">
                  <button
                    className="toggle-more"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    {expandedIndex === index ? (
                      <FontAwesomeIcon icon={faArrowUp} />
                    ) : (
                      <FontAwesomeIcon icon={faArrowDown} />
                    )}
                  </button>
                </div>
                <h2 className="event-title">{event.eventName}</h2>
                <div className="myreg-info">
                  <p>
                    <FontAwesomeIcon icon={faCalendarDays} />{" "}
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faLocationDot} /> {event.location}
                  </p>
                  <p
                    className={
                      getEventStatus(event.eventDate) === "Ended"
                        ? "status-ended"
                        : "status-confirmed"
                    }
                  >
                    <FontAwesomeIcon
                      icon={
                        getEventStatus(event.eventDate) === "Ended"
                          ? faSquareXmark
                          : faSquareCheck
                      }
                    />{" "}
                    {getEventStatus(event.eventDate)}
                  </p>
                </div>

                {expandedIndex === index && (
                  <dl className="event-description">
                    <div className="flexeveid">
                      <p className="registered">
                        Registered:{" "}
                        {new Date(event.bookedDate).toLocaleDateString()}
                      </p>
                      <p className="eventid">ID: {event.eventId}</p>
                    </div>
                    {getEventStatus(event.eventDate) === "Confirmed" && (
                      <dd>
                        <button
                          className="cancel-event"
                          onClick={() => handleCancel(event.eventId)}
                        >
                          Cancel Event <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </dd>
                    )}
                  </dl>
                )}
              </div>
            ))
          ) : (
            <p className="no-event">
              You haven’t registered for any events yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRegistrations;
