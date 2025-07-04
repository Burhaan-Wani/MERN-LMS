const mongoose = require("mongoose");
const { MONGO_URI } = require(".");

const connectDB = async function () {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error while connecting DB");
        process.exit(1);
    }
};

module.exports = connectDB;
