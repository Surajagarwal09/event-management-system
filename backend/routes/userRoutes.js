const express = require('express');
const { registerUser, loginUser, getUserDetails, getAllUsers, getUserRegistrations } = require('../controllers/userControllers');

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/details", getUserDetails);
router.get("/all", getAllUsers);
router.get("/:userId/registrations", getUserRegistrations); 
module.exports = router;