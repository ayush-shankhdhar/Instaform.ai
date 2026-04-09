const mongoose = require('mongoose');

const connectToDB = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        return;
    }
    if (connectionState === 2) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGOURL);
        console.log("MongoDB connected!");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
};

module.exports = connectToDB;