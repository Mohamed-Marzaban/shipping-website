const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const setUpMiddleWare = require('./config/middleware');

dotenv.config();

// Create an express app
const app = express();

// Setup middleware
setUpMiddleWare(app);


const startServer = async () => {
    try {

        await connectDB();
        console.log('✅ Connected to the database');

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error.message);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});
startServer();
