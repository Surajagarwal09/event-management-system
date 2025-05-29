import React from "react";
import "../css/EventCard.css";
import { useNavigate } from "react-router-dom";

function EventCard({ events }) {
  const navigate = useNavigate();

  return (
    <div className="user-event-card-lists">
      <h1 className="user-event-card-header">
        {events.length ? "Filtered Events:" : "All Events:"}
      </h1>

      {events.length === 0 ? (
        <div className="user-no-events-container">
          <p className="user-no-events-message">No Events Found.</p>
        </div>
      ) : (
        <div className="user-event-cards">
          {events.map((event, index) => (
            <div key={index} className="user-event-card">
              <img src={`http://localhost:5000/${event.coverImage}`} alt="Event" />
              <div className="user-event-card-content">
                <h2 className="user-card-title">{event.eventName}</h2>
                <div className="user-left-content">
                  <p className="user-card-desc">{event.Homedescription}</p>
                  <p className="user-card-date">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </p>
                  <p className="user-card-location">{event.location}</p>
                </div>
                <div className="user-card-button">
                  <button onClick={() => navigate(`/EventDetails/${event._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventCard;
