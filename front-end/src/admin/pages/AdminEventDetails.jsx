import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faCalendar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "../css/AdminEventDetails.css";

function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );
      setEvent(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}/delete`);
        alert("Event deleted successfully");
        navigate("/admin/events");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete event");
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/admin/events/update/${id}`);
  };

  if (!event) return <p>Loading Event Details...</p>;

  return (
    <div className="admin-event-page">
      <AdminSidebar />
      <div className="admin-event-detail">
        <div className="admin-event-detail-h1">
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
            <button className="btn-delete" onClick={handleDelete}>
              Delete Event
            </button>
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
            <p>Registerations: {event.totalregistration}</p>
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
        <button className="btn-delete" onClick={handleDelete}>
          Delete
        </button>
      </div>

    </div>
  );
}

export default AdminEventDetails;
