const Location = require("../models/Location");

const addCity = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city || typeof city !== "string" || city.trim() === "") {
      return res.status(400).json({ message: "Invalid city name" });
    }

    const trimmedCity = city.trim();

    let location = await Location.findOne();

    if (!location) {
      location = new Location({ cities: [trimmedCity] });
    } else {
      const cityExists = location.cities.some(
        (c) => c.trim().toLowerCase() === trimmedCity.toLowerCase()
      );

      if (cityExists) {
        return res.status(400).json({ message: "City already exists" });
      }

      location.cities.push(trimmedCity);
    }

    await location.save();

    res.status(201).json({ message: "City added successfully", data: location });
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ message: "Error adding city", error });
  }
};


const getAllCities = async (req, res) => {
    try {
        const location = await Location.findOne({});
        if (!location) {
            return res.status(404).json({ message: "No cities found" });
        }
        res.status(200).json({ message: "Cities retrieved successfully", data: location.cities });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cities", error });
    }
};

const deleteCity = async (req, res) => {
    try {
        const { city } = req.params;

        const location = await Location.findOne({});
        if (!location || !location.cities.includes(city)) {
            return res.status(404).json({ message: "City not found" });
        }

        location.cities = location.cities.filter(c => c !== city);
        await location.save();

        res.status(200).json({ message: "City deleted successfully", data: location.cities });
    } catch (error) {
        res.status(500).json({ message: "Error deleting city", error });
    }
};

module.exports = { addCity, deleteCity, getAllCities };