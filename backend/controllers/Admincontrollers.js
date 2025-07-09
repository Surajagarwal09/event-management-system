const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (admin) => {
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const adminSignup = async (req, res) => {
  try {
    const { fullname, email, password, phoneno } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      fullname,
      email,
      password: hashedPassword,
      phoneno,
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
};

 const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(admin);

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        fullname: admin.fullname,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};

module.exports = { adminSignup, adminLogin };