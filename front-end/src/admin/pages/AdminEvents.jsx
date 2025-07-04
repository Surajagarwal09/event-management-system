import React, { useState, useEffect } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import "../css/AdminEvents.css";
import Filter from "../../components/Filter";
import { useNavigate } from "react-router-dom";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
  
      
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (filteredData) => {
    setFilteredEvents(filteredData.length ? filteredData : []);
  };

  const handledetailslink = (eventId,e) => {
    e.preventDefault();
    navigate(`/admin/events/details/${eventId}`);
  }

  return (
    <div className="admin-event-card-lists">
      <AdminSidebar />
      <div className="admin-event-content">
        <Filter onFilterChange={handleFilterChange} />

        <h1 className="admin-event-card-header">
          {filteredEvents.length ? "Filtered Events:" : "All Events:"}
        </h1>

        {filteredEvents.length === 0 ? (
          <div className="admin-no-events-container">
            <p className="admin-no-events-message">No Events Found.</p>
          </div>
        ) : (
          <div className="admin-event-cards">
            {filteredEvents.map((event, index) => (
              <div
                key={event._id}
                className="admin-event-card"
                onClick={(e)=>handledetailslink(event._id,e)}
                style={{ cursor: "pointer" }}
              >
                <div className="admin-image-date">
                  <img
                    src={`http://localhost:5000/${event.coverImage}`}
                    alt="Event"
                  />
                  <div className="admin-date-div">
                    <p className="admin-card-date">
                      Date: {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="admin-event-card-content">
                  <h2 className="admin-card-title">{event.eventName}</h2>
                  <div className="admin-left-content">
                    <p className="admin-card-location">
                      Location: {event.location}
                    </p>
                    <p className="admin-card-desc">{event.Homedescription}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEvents;
