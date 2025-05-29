const express = require("express");
const { addCity, deleteCity, getAllCities } = require("../controllers/LocationControllers");


const router = express.Router();

router.post("/add", addCity);
router.get("/cities", getAllCities);
router.delete("/delete/:city", deleteCity);

module.exports = router;