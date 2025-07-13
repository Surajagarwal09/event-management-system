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
import FullScreenLoader from "../components/FullscreenLoader";
import ButtonLoader from "../components/ButtonLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";

function EventDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonloading, setButtonloading] = useState(false);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/${id}`
      );
      setEvent(response.data);

      const eventDate = new Date(response.data.eventDate);
      const today = new Date();
      setIsEventEnded(eventDate < today);
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

  const checkRegistrationStatus = () => {
    if (!user.token || !event?.registeredusers) {
      setIsRegistered(false);
      return;
    }

    try {
      const decoded = jwtDecode(user.token);
      const userId = decoded.id;

      const registered = event.registeredusers.some((u) => u.userId === userId);
      setIsRegistered(registered);
    } catch (err) {
      console.error("Token decode failed", err);
      setIsRegistered(false);
    }
  };
  useEffect(() => {
    if (event && user.token) {
      checkRegistrationStatus();
    }
  }, [user.token, event]);

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

  const handleRegister = async (e) => {
    setButtonloading(true);
    e.preventDefault();

    if (isRegistered) return;

    if (!user.token) {
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
        `${process.env.REACT_APP_BACKEND_URL}/api/events/${id}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Registered successfully!");

      const decoded = jwtDecode(user.token);
      const userId = decoded.id;

      setEvent((prevEvent) => ({
        ...prevEvent,
        registeredusers: [
          ...(prevEvent?.registeredusers || []),
          {
            userId,
            fullname: user.fullname,
          },
        ],
      }));

      setIsRegistered(true);
      checkRegistrationStatus();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error("You have already registered for the event");
      } else {
        toast.error("Registration failed");
      }
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
                  src={`${process.env.REACT_APP_BACKEND_URL}/${event.image1}`}
                  className="d-block w-100"
                  alt="Event Image 1"
                  loading="lazy"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${event.image2}`}
                  className="d-block w-100"
                  alt="Event Image 2"
                  loading="lazy"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${event.image3}`}
                  className="d-block w-100"
                  alt="Event Image 3"
                  loading="lazy"
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
