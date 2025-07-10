import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import Filter from "../components/Filter";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsStart,
  fetchEventsSuccess,
  fetchEventsFailure,
} from "../redux/EventSlice";
import FullScreenLoader from "../components/FullscreenLoader";
import { toast } from "react-toastify";

function EventList() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(fetchEventsStart());
      try {
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/events`
        );
        dispatch(fetchEventsSuccess(response.data));
        setFilteredEvents(response.data);
      } catch (error) {
        dispatch(fetchEventsFailure(error.message));
        toast.error("Failed to load events. Please try again.");
      }
    };
    fetchEvents();
  }, [dispatch]);

  const handleFilterChange = (filteredData) => {
    setFilterLoading(true);
    setFilteredEvents(filteredData.length ? filteredData : []);
    setFilterLoading(false);
  };

  return (
    <div>
      <Navbar />
      {(loading || filterLoading) && <FullScreenLoader />}
      <Filter
        onFilterChange={handleFilterChange}
        setFilterLoading={setFilterLoading}
      />

      {!loading && <EventCard events={filteredEvents} />}
    </div>
  );
}

export default EventList;
