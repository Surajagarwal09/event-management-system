const express = require("express");
const { createEvent, getEvents, getEventById, registerUserForEvent, cacelUserRegistration, deleteEvent, updateEvent,getEventBySearch, getAdminDashboardStats } = require("../controllers/eventControllers");
const upload = require("../middleware/uploadMiddleware")

const router = express.Router();

router.post("/create", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },]), createEvent);

router.get("/", getEvents);

router.get("/search", getEventBySearch);

router.get("/:id", getEventById);

router.post("/:id/register", registerUserForEvent);

router.post("/:id/cancel", cacelUserRegistration);

router.put("/:id/update", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 }
]), updateEvent);

router.delete("/:id/delete", deleteEvent);

router.get("/admin/dashboard",getAdminDashboardStats)


module.exports = router;