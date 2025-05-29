import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/AddEvent.css";
import AdminSidebar from "../component/AdminSidebar";

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    Homedescription: "",
    eventDescription: "",
  });

  const [images, setImages] = useState({
    coverImage: null,
    image1: null,
    image2: null,
    image3: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        const data = response.data;

        setEventData({
          eventName: data.eventName,
          eventDate: data.eventDate.split("T")[0],
          location: data.location,
          Homedescription: data.Homedescription,
          eventDescription: data.eventDescription,
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        alert("Failed to load event data.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => formData.append(key, value));
    Object.entries(images).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.put(`http://localhost:5000/api/events/${id}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Event update failed.");
    }
  };

  return (
    <div className="Add-events">
      <AdminSidebar />
      <div className="event-upload-container">
        <form className="event-upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            placeholder="Event Name"
            className="event-input"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            className="event-input"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            value={eventData.location}
            placeholder="Location"
            className="event-input"
            onChange={handleChange}
            required
          />
          <textarea
            name="Homedescription"
            value={eventData.Homedescription}
            placeholder="Home Description"
            maxLength={61}
            className="event-textarea"
            onChange={handleChange}
            required
          ></textarea>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            placeholder="Event Description"
            maxLength={611}
            className="event-textarea"
            onChange={handleChange}
            required
          ></textarea>

          <div className="labelflex1">
            <label className="event-label">Cover Image:</label>
            <label className="event-label">Image 1:</label>
          </div>
          <div className="imageflex1">
            <input
              type="file"
              name="coverImage"
              className="event-file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
            <input
              type="file"
              name="image1"
              className="event-file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="labelflex2">
            <label className="event-label">Image 2:</label>
            <label className="event-label">Image 3:</label>
          </div>
          <div className="imageflex2">
            <input
              type="file"
              name="image2"
              className="event-file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
            <input
              type="file"
              name="image3"
              className="event-file-input"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="event-submit-button">
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;
