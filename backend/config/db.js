const mongoose = require('mongoose');
require('dotenv').config();

const connnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            UsenewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDb Connected");
        
    } catch (error) {
        console.error("MongoDb connection Error:", error);
        process.exit(1);
    }
}

module.exports = connnectDb;