import React, { useState, useRef } from "react";
import axios from "axios";
import "../css/AddEvent.css";
import AdminSidebar from "../component/AdminSidebar";
import ButtonLoader from "../../components/ButtonLoader";
import { toast } from "react-toastify";
import CustomDatePicker from "../../components/Datepicker";
const AddEvent = () => {
  const [buttonloading, setButtonloading] = useState(false);
  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: null,
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

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages({ ...images, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonloading(true);

    const formattedDate =
      eventData.eventDate instanceof Date
        ? `${eventData.eventDate.getFullYear()}-${String(
            eventData.eventDate.getMonth() + 1
          ).padStart(2, "0")}-${String(eventData.eventDate.getDate()).padStart(
            2,
            "0"
          )}`
        : eventData.eventDate;

    const formData = new FormData();
    formData.append("eventDate", formattedDate);

    Object.entries(eventData).forEach(([key, value]) => {
      if (key !== "eventDate") {
        formData.append(key, value);
      }
    });

    Object.entries(images).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/events/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Event Uploaded Successfully!");

      setEventData({
        eventName: "",
        eventDate: null,
        location: "",
        Homedescription: "",
        eventDescription: "",
      });

      setImages({
        coverImage: null,
        image1: null,
        image2: null,
        image3: null,
      });

      coverRef.current.value = null;
      image1Ref.current.value = null;
      image2Ref.current.value = null;
      image3Ref.current.value = null;
    } catch (error) {
      console.error("Error uploading event:", error);
      toast.error("Event upload failed.");
    } finally {
      setButtonloading(false);
    }
  };

  const coverRef = useRef();
  const image1Ref = useRef();
  const image2Ref = useRef();
  const image3Ref = useRef();

  return (
    <div className="Add-events">
      <AdminSidebar />
      <div className="Addevent-h1">
        <h1 className="event-upload-title">Add Event</h1>
      </div>
      <div className="event-upload-container">
        <form className="event-upload-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="eventName"
            maxLength={32}
            placeholder="Event Name"
            className="event-input"
            value={eventData.eventName}
            onChange={handleChange}
            required
            disabled={buttonloading}
          />
          <CustomDatePicker
             className="event-input"
            date={eventData.eventDate}
            setDate={(selectedDate) =>
              setEventData((prev) => ({ ...prev, eventDate: selectedDate }))
            }
            mode="admin"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="event-input"
            value={eventData.location}
            onChange={handleChange}
            required
            disabled={buttonloading}
          />

          <textarea
            name="Homedescription"
            placeholder="Home Description"
            maxLength={61}
            className="event-textarea"
            value={eventData.Homedescription}
            onChange={handleChange}
            required
            disabled={buttonloading}
          ></textarea>

          <textarea
            name="eventDescription"
            placeholder="Event Description"
            maxLength={611}
            className="event-textarea"
            value={eventData.eventDescription}
            onChange={handleChange}
            required
            disabled={buttonloading}
          ></textarea>

          <div className="file-flex">
            <div className="label-flex1">
              <label className="event-label">Cover Image:</label>
              <input
                type="file"
                name="coverImage"
                ref={coverRef}
                className="event-file-input"
                onChange={handleFileChange}
                accept="image/*"
                disabled={buttonloading}
              />
            </div>

            <div className="label-flex1">
              <label className="event-label">Image 1:</label>
              <input
                type="file"
                name="image1"
                ref={image1Ref}
                className="event-file-input"
                onChange={handleFileChange}
                accept="image/*"
                disabled={buttonloading}
              />
            </div>
          </div>

          <div className="file-flex">
            <div className="label-flex2">
              <label className="event-label">Image 2:</label>
              <input
                type="file"
                name="image2"
                ref={image2Ref}
                className="event-file-input"
                onChange={handleFileChange}
                accept="image/*"
                disabled={buttonloading}
              />
            </div>

            <div className="label-flex2">
              <label className="event-label">Image 3:</label>
              <input
                type="file"
                name="image3"
                ref={image3Ref}
                className="event-file-input"
                onChange={handleFileChange}
                accept="image/*"
                disabled={buttonloading}
              />
            </div>
          </div>

          <ButtonLoader
            type="submit"
            className="event-submit-button"
            loading={buttonloading}
          >
            Upload Event
          </ButtonLoader>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
