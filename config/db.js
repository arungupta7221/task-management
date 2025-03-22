// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) { // Only connect if not already connected
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('MongoDB Connected');
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }
};

module.exports = connectDB;