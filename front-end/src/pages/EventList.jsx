import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Filter from "../components/Filter";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux"
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
} from "../redux/EventSlice";

function EventList() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(fetchEventsStart());
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        dispatch(fetchEventsSuccess(response.data));
        setFilteredEvents(response.data);
      } catch (error) {
        dispatch(fetchEventsFailure(error.message));
      }
    };
    fetchEvents();
  }, [dispatch]);

  const handleFilterChange = (filteredData) => {
    setFilteredEvents(filteredData.length ? filteredData : []);
};

  return (
    <div>
      <Navbar />
      <Filter onFilterChange={handleFilterChange} />
      {loading && <p className="loading">Loading Events...</p>}
      {error && <p className="error">failed to load events:{ error}</p>}
      <EventCard events={filteredEvents} />
    </div>
  );
}

export default EventList;