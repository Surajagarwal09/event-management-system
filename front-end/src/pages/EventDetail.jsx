import React from "react";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarDays,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import "../css/EventDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import FullScreenLoader from "../components/FullscreenLoader";
import ButtonLoader from "../components/ButtonLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonloading, setButtonloading] = useState(false);

  const fetchEventDetails = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      setLoading(true);
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
      setError("Event not found or something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="event-content-loader-wrapper">
          <FullScreenLoader />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div>
        <Navbar />
        <div className="event-detail-error">
          <h2>This event doesn't exist or may have been removed</h2>
        </div>
      </div>
    );

  const handleRegister = async () => {
    setButtonloading(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    if (isRegistered) {
      setButtonloading(false);
      return;
    }
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Log in to join the event.");
      setButtonloading(false);
      return;
    }

    const result = await Swal.fire({
      title: "Register for Event?",
      text: "Are you sure you want to register for this event?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        popup: "swal2-dark",
      },
    });

    if (!result.isConfirmed) {
      setButtonloading(false);
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
      toast.success("Registered successfully!");
      fetchEventDetails();
    } catch (err) {
      // console.error("Registration failed:", err.response?.data || err);
      toast.error("Registration failed");
    } finally {
      setButtonloading(false);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="event-detail">
        <div className="h1">
          <h1>{event.eventName}</h1>
        </div>
        <div className="eventd-img">
          {/* <div className="carousel"> */}
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
          {/* </div> */}

          <div className="datlocreg">
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
            <hr className="eventdet-hrtag" />

            <div className="event-regbtn desktop-only">
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
                  <ButtonLoader
                    onClick={handleRegister}
                    loading={buttonloading}
                    type="submit"
                    className="allreg"
                  >
                    Register Now
                  </ButtonLoader>
                </div>
              )}
            </div>
            <div className="bottom-bar mobile-only">
              {isEventEnded ? (
                <button disabled className="eventended">
                  Event Ended
                </button>
              ) : isRegistered ? (
                <button disabled className="disabbutt">
                  Event Registered
                </button>
              ) : (
                <ButtonLoader
                  onClick={handleRegister}
                  loading={buttonloading}
                  type="submit"
                  className="eventreg"
                >
                  Register Now
                </ButtonLoader>
              )}
            </div>
          </div>
        </div>

        <div className="eventd-info">
          <h3>About The Event</h3>
          <p className="event-det">{event.eventDescription}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
