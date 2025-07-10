const express = require('express');
const { registerUser, loginUser, getUserDetails, getAllUsers, getUserRegistrations,getUserDetailsById } = require('../controllers/userControllers');

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/details", getUserDetails);
router.get("/:userId/details", getUserDetailsById);
router.get("/all", getAllUsers);
router.get("/:userId/registrations", getUserRegistrations); 
module.exports = router;