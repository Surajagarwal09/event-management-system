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
import FullscreenLoader from "../components/FullscreenLoader";
import ButtonLoader from "../components/ButtonLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function MyRegistrations() {
  const [events, setEvents] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonloading, setButtonloading] = useState(false);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/registrations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const registeredEvents = response.data || [];

        const sortedEvents = registeredEvents.sort((a, b) => {
          const isAEnded = new Date(a.eventDate) < new Date();
          const isBEnded = new Date(b.eventDate) < new Date();

          if (isAEnded && !isBEnded) return 1;
          if (isAEnded && isBEnded) return -1;
          return new Date(b.bookedDate) - new Date();
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
        toast.error("Unable to load registrations.");
      } finally {
        setLoading(false);
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
    const result = await Swal.fire({
      title: "Cancel Event?",
      text: "Are you sure you want to cancel this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        popup: "swal2-dark",
      },
    });

    if (!result.isConfirmed) return;

    setButtonloading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first.");
      setButtonloading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/${eventId}/cancel`,
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

      toast.success("Event cancelled successfully!");
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error("Failed to cancel event.");
    } finally {
      setButtonloading(false);
    }
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <FullscreenLoader />
      ) : (
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
                          <ButtonLoader
                            loading={buttonloading}
                            type="submit"
                            className="cancel-event"
                            onClick={() => handleCancel(event.eventId)}
                          >
                            Cancel Event <FontAwesomeIcon icon={faXmark} />
                          </ButtonLoader>
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
      )}
    </div>
  );
}

export default MyRegistrations;
