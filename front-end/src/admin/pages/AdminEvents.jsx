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

  return (
    <div className="admin-events">
      <AdminSidebar />
      <div className="admin-event-content">
        <Filter onFilterChange={handleFilterChange} />

        <div className="admin-event-card-lists">
          <h1 className="admin-event-card-header">
           All Events:
          </h1>

          {filteredEvents.length === 0 ? (
            <div className="admin-no-events-container">
              <p className="admin-no-events-message">No Events Found.</p>
            </div>
          ) : (
            <div className="admin-event-cards">
              {filteredEvents.map((event, index) => (
                <div key={index} className="admin-event-card">
                  <img
                    src={`http://localhost:5000/${event.coverImage}`}
                    alt="Event"
                  />
                  <div className="admin-event-card-content">
                    <h2 className="admin-card-title">{event.eventName}</h2>
                    <div className="admin-left-content">
                      <p className="admin-card-date">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </p>
                      <p className="admin-card-location">{event.location}</p>
                    </div>
                    <div className="admin-card-button">
                      <button
                        onClick={() => navigate(`/admin/events/details/${event._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminEvents;
