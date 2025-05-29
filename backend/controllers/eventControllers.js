const { Query } = require("mongoose");
const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, location, Homedescription, eventDescription } = req.body;

    if (!req.files || !req.files.coverImage || !req.files.image1 || !req.files.image2 || !req.files.image3) {
      return res.status(400).json({ message: "All images must be uploaded" });
    }

    const coverImage = req.files.coverImage[0].path;
    const image1 = req.files.image1[0].path;
    const image2 = req.files.image2[0].path;
    const image3 = req.files.image3[0].path;

    const newEvent = await Event.create({
      eventName,
      eventDate,
      location,
      Homedescription,
      eventDescription,
      coverImage,
      image1,
      image2,
      image3
    });

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Event creation failed", error });
  }
};



const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch events", error
    })
  }
};


const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({
      message: "Event Not Found"
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "failed To Ftech event", error
    });
  }
};


const registerUserForEvent = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const userId = decoded.id;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event Not Found" });

    const isRegistered = event.registeredusers.some(user => user.userId.toString() === userId);
    if (isRegistered) return res.status(400).json({ message: "User is already registered for this event" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    event.registeredusers.push({
      userId: user._id,
      fullname: user.fullname,
      registerDate: new Date(),
    });
    event.totalregistration += 1;
    await event.save();

    user.registeredEvents.push({
      eventId: event._id,
      eventName: event.eventName,
      eventDate: event.eventDate,
      location: event.location,
      bookedDate: new Date(),
    });
    await user.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};



const cacelUserRegistration = async (req, res) => {
  try {
    const { userId } = req.body;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    const wasRegistered = event.registeredusers.some(
      (user) => user.userId.toString() === userId
    );
    if (!wasRegistered) {
      return res.status(400).json({ message: "user was not registered for the event" })
    }

    event.registeredusers = event.registeredusers.filter(
      (user) => user.userId.toString() !== userId
    );

    event.totalregistration = Math.max(0, event.totalregistration - 1);
    await event.save();

    user.registeredEvents = user.registeredEvents.filter(
      (reg) => reg.eventId.toString() !== eventId
    );

    user.cancelledEvents.push({
      eventId: event._id,
      eventName: event.eventName,
      eventDate: event.eventDate,
      location: event.location,
      status: "Cancelled",
      cancelledDate: new Date(),
    });

    await user.save();

    res.status(200).json({ message: "User registration canceled", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel registration", error });
  }
};



const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to delete Event", error })
  }
};


const updateEvent = async (req, res) => {
  try {
    const { eventName, eventDate, location, Homedescription, eventDescription } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });


    event.eventName = eventName || event.eventName;
    event.eventDate = eventDate || event.eventDate;
    event.location = location || event.location;
    event.Homedescription = Homedescription || event.Homedescription;
    event.eventDescription = eventDescription || event.eventDescription;

    const deleteOldImage = (filePath) => {
      if (filePath && fs.existsSync(path.join(__dirname, "..", filePath))) {
        fs.unlinkSync(path.join(__dirname, "..", filePath));
      }
    };

    if (req.files.coverImage) {
      deleteOldImage(event.coverImage);
      event.coverImage = req.files.coverImage[0].path;
    }
    if (req.files.image1) {
      deleteOldImage(event.image1);
      event.image1 = req.files.image1[0].path;
    }
    if (req.files.image2) {
      deleteOldImage(event.image2);
      event.image2 = req.files.image2[0].path;
    }
    if (req.files.image3) {
      deleteOldImage(event.image3);
      event.image3 = req.files.image3[0].path;
    }

    await event.save();

    await User.updateMany(
      { "registeredEvents.eventId": event._id },
      {
        $set: {
          "registeredEvents.$[elem].eventName": event.eventName,
          "registeredEvents.$[elem].eventDate": event.eventDate,
          "registeredEvents.$[elem].location": event.location
        }
      },
      {
        arrayFilters: [{ "elem.eventId": event._id }]
      }
    );

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Failed to update event:", error);
    res.status(500).json({ message: "Failed to update event", error });
  }
};



const getEventBySearch = async (req, res) => {
  try {
    const { query, date, location } = req.query;
    const searchParams = {};

    if (query) searchParams.eventName = new RegExp(query, "i");
    if (location) searchParams.location = new RegExp(location, "i");
    if (date) searchParams.eventDate = date;

    const events = await Event.find(searchParams);

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found", data: [] });
    }
    res.status(200).json({ message: "Events retrieved successfully", data: events });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getAdminDashboardStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegisteredUsers = await User.countDocuments();

    const topEvents = await Event.find({})
      .sort({ totalregistration: -1 })
      .limit(4)
      .select("_id eventName eventDate totalregistration");

    const topEventsFormatted = topEvents.map(event => ({
      id: event._id,
      name: event.eventName,
      date: event.eventDate.toISOString().split("T")[0],
      registeredUsers: event.totalregistration,
    }));

    res.status(200).json({
      totalEvents,
      totalRegisteredUsers,
      topEvents: topEventsFormatted,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data", error });
  }
};




module.exports = { createEvent, getEvents, getEventById, registerUserForEvent, cacelUserRegistration, deleteEvent, updateEvent, getEventBySearch, getAdminDashboardStats };