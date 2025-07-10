const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken"); 

const registerUser = async (req, res) => {
  try {
    const { fullname, email, dob, phoneno } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ fullname, email, dob, phoneno });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, dob } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    if (new Date(user.dob).toISOString().split("T")[0] !== dob) {
      return res.status(400).json({ message: "Invalid Date of Birth" });
    }

    const token = generateToken(user._id);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });

  }
};

const getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided. Unauthorized access." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User details retrieved successfully", user });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

const getUserDetailsById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User details retrieved", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "fullname email registeredEvents") 
      .populate("registeredEvents", "_id")
      .lean();

    const formattedUsers = users.map(user => ({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      registeredEventCount: user.registeredEvents ? user.registeredEvents.length : 0
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};


const getUserRegistrations = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const registrations = user.registeredEvents.map(reg => ({
      eventId: reg.eventId,
      eventName: reg.eventName,
      eventDate: reg.eventDate,
      bookedDate: reg.bookedDate,
      location: reg.location,
      status: reg.status
    }));

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    res.status(500).json({ message: "Failed to fetch registrations", error });
  }
};




module.exports = { registerUser, loginUser, getUserDetails, getAllUsers,getUserRegistrations,getUserDetailsById };

