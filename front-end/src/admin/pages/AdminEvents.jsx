import React, { useState, useEffect } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import "../css/AdminEvents.css";
import Filter from "../../components/Filter";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
} from "../../redux/EventSlice";
import FullScreenLoader from "../../components/FullscreenLoader";

function AdminEvents() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(fetchEventsStart());
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/events`
        );
        dispatch(fetchEventsSuccess(response.data));
        setFilteredEvents(response.data);
      } catch (error) {
        dispatch(fetchEventsFailure(error.message));
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [dispatch]);

  const handleFilterChange = (filteredData) => {
    setFilterLoading(true);
    setFilteredEvents(filteredData.length ? filteredData : []);
    setFilterLoading(false);
  };

  const handledetailslink = (eventId, e) => {
    e.preventDefault();
    navigate(`/admin/events/details/${eventId}`);
  };

  return (
    <div className="admin-event-card-lists">
      <AdminSidebar />

      <div className="admin-event-content">
        {loading ? (
          <div className="event-content-loader-wrapper">
            <FullScreenLoader />
          </div>
        ) : (
          <>
            <div className="filter-section-wrapper">
              {filterLoading && <FullScreenLoader />}

              <Filter
                onFilterChange={handleFilterChange}
                setFilterLoading={setFilterLoading}
              />

              <h1 className="admin-event-card-header">
                {filteredEvents.length ? "Filtered Events:" : "All Events:"}
              </h1>
              {filteredEvents.length === 0 ? (
                <div className="admin-no-events-container">
                  <p className="admin-no-events-message">No Events Found.</p>
                </div>
              ) : (
                <div className="admin-event-cards">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="admin-event-card"
                      onClick={(e) => handledetailslink(event._id, e)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="admin-image-date">
                        <img
                          src={`${process.env.REACT_APP_BACKEND_URL}/${event.coverImage}`}
                          alt="Event"
                        />
                        <div className="admin-date-div">
                          <p className="admin-card-date">
                            Date:{" "}
                            {new Date(event.eventDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="admin-event-card-content">
                        <h2 className="admin-card-title">{event.eventName}</h2>
                        <div className="admin-left-content">
                          <p className="admin-card-location">
                            Location: {event.location}
                          </p>
                          <p className="admin-card-desc">
                            {event.Homedescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminEvents;
