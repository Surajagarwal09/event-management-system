import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../css/UpdateEvent.css";
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
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`
        );
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
    Object.entries(eventData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    Object.entries(images).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Event updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Event update failed.");
    }
  };

  return (
    <div className="update-events">
      <AdminSidebar />
      <div className="update-flex">
        <button className="update-close-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="update-title">Update Event</h1>
      </div>

      <div className="update-form-container">
        <form className="update-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="eventName"
            value={eventData.eventName}
            maxLength={32}
            placeholder="Event Name"
            className="update-input"
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="eventDate"
            value={eventData.eventDate}
            className="update-input"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            value={eventData.location}
            placeholder="Location"
            className="update-input"
            onChange={handleChange}
            required
          />
          <textarea
            name="Homedescription"
            value={eventData.Homedescription}
            placeholder="Home Description"
            maxLength={61}
            className="update-textarea"
            onChange={handleChange}
            required
          ></textarea>
          <textarea
            name="eventDescription"
            value={eventData.eventDescription}
            placeholder="Event Description"
            maxLength={611}
            className="update-textarea"
            onChange={handleChange}
            required
          ></textarea>

          <div className="update-file-flex">
            <div className="update-label-flex1">
              <label className="update-label">Cover Image:</label>
              <input
                type="file"
                name="coverImage"
                className="update-file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="update-image-flex1">
              <label className="update-label">Image 1:</label>
              <input
                type="file"
                name="image1"
                className="update-file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

          </div>
          <div className="update-file-flex">
            <div className="update-label-flex2">
              <label className="update-label">Image 2:</label>
              <input
                type="file"
                name="image2"
                className="update-file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div className="update-image-flex2">
              <label className="update-label">Image 3:</label>
              <input
                type="file"
                name="image3"
                className="update-file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>

          <button type="submit" className="update-submit-button">
            Update Event
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;
