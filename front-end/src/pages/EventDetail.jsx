import React from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import "../css/EventDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );
      setEvent(response.data);

      const eventDate = new Date(response.data.eventDate);
      const today = new Date();
      setIsEventEnded(eventDate < today);

      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const registered = response.data.registeredusers.some(
          (user) => user.userId === userId
        );
        setIsRegistered(registered);
      }
    } catch (error) {
      console.error("Error Fetching Events Details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (!event) return <p>Loading Event Details ...</p>;

  const handleRegister = async () => {
    if (isRegistered) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to register for the event.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Registered successfully!");
      fetchEventDetails();
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="event-detail">
        <div className="eventd-img">
          <div
            id="carouselExample"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={`http://localhost:5000/${event.image1}`}
                  className="d-block w-100"
                  alt="Event Image 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`http://localhost:5000/${event.image2}`}
                  className="d-block w-100"
                  alt="Event Image 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`http://localhost:5000/${event.image3}`}
                  className="d-block w-100"
                  alt="Event Image 3"
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <div className="datlocreg">
            <div className="h1">
              <h1>{event.eventName}</h1>
            </div>
            <div className="event-dl">
              <p className="event-d">
                <FontAwesomeIcon icon={faCalendarDays} /> <b>Date: </b>{" "}
                {new Date(event.eventDate).toLocaleDateString()}
              </p>
              <p className="event-l">
                <FontAwesomeIcon icon={faLocationDot} /> <b>Location:</b>{" "}
                {event.location}
              </p>
            </div>
            <div className="event-regbtn">
              {isEventEnded ? (
                <div className="event-ended">
                  <button disabled className="eveended">
                    Event Ended
                  </button>
                </div>
              ) : isRegistered ? (
                <div className="disbaled">
                  <button disabled className="disbutt">
                    Event Registered
                  </button>
                </div>
              ) : (
                <div className="allowreg">
                  <button className="allreg" onClick={handleRegister}>
                    Register Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="eventd-info">
          <h3>About the Event</h3>
          <p className="event-det">{event.eventDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
