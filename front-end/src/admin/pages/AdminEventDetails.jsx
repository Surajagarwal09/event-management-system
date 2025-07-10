import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../css/AdminEventDetails.css";
import FullScreenLoader from "../../components/FullscreenLoader";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ButtonLoader from "../../components/ButtonLoader";

function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [buttonloading, setButtonloading] = useState(false);
  const [error, setError] = useState(false);

  const fetchEventDetails = async () => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleDelete = async () => {
    setButtonloading(true);

    const result = await Swal.fire({
      title: "Delete Event?",
      text: "Are you sure you want to Delete this event?",
      icon: "warning",
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

    setDeleting(true);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}/delete`);
      toast.success("Event deleted successfully");
      navigate("/admin/events");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete event");
    } finally {
      setButtonloading(false);
      setDeleting(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    navigate(`/admin/events/update/${id}`);
  };

  if (loading) {
    return (
      <>
        <AdminSidebar />
        <div className="admin-loader-wrapper">
          <FullScreenLoader />
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <AdminSidebar />
        <div className="admin-event-detail-error">
          <h2>This event doesn't exist or may have been removed</h2>
        </div>
      </>
    );
  }

  return (
    <div className="admin-event-page">
      <AdminSidebar />
      {deleting && <FullScreenLoader />}

      <div className="admin-event-detail">
        <div className="admin-event-detail-h1">
          <button onClick={() => navigate(-1)} className="previous1-button">
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1>{event.eventName}</h1>
        </div>

        <div className="admin-event-images">
          <div
            id="adminCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={`http://localhost:5000/${event.image1}`}
                  alt="Event 1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`http://localhost:5000/${event.image2}`}
                  alt="Event 2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={`http://localhost:5000/${event.image3}`}
                  alt="Event 3"
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#adminCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#adminCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <div className="admin-event-actions">
            <button className="btn-update" onClick={handleUpdate}>
              Update Event
            </button>
            <ButtonLoader
              loading={buttonloading}
              className="btn-delete"
              onClick={handleDelete}
            >
              Delete Event
            </ButtonLoader>
          </div>
        </div>

        <div className="admin-event-info-box">
          <div className="admin-event-meta">
            <p>
              <FontAwesomeIcon icon={faCalendar} />{" "}
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} /> {event.location}
            </p>
            <p>Registrations: {event.totalregistration}</p>
          </div>
        </div>

        <div className="admin-event-description">
          <h3>About the Event</h3>
          <p>{event.eventDescription}</p>
        </div>
      </div>

      <div className="admin-bottom-bar mobile-only">
        <button className="btn-update" onClick={handleUpdate}>
          Update
        </button>
        <ButtonLoader
          loading={buttonloading}
          className="btn-delete"
          onClick={handleDelete}
        >
          Delete
        </ButtonLoader>
      </div>
    </div>
  );
}

export default AdminEventDetails;
