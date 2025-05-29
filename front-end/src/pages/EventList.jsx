import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Filter from "../components/Filter";
import axios from "axios";

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

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
    <div>
      <Navbar />
      <Filter onFilterChange={handleFilterChange} />
      <EventCard events={filteredEvents} />
    </div>
  );
}

export default EventList;