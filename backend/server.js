const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const LocationRoutes = require("./routes/LocationRoutes");
const adminRoutes =require("./routes/AdminRoutes")

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDb Connected"))
    .catch((error) => console.log("MongoDb connection Failed:", error));
    


app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/locations", LocationRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})