const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const setUpMiddleWare = require('./config/middleware');
const organizationRoutes = require('./routes/organizationRoutes')
const orderRoutes = require('./routes/orderRoutes')
const authMiddleware = require('./middlewares/authMiddleware')

dotenv.config();

// Create an express app
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

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

startServer();

app.use('/api/organization', organizationRoutes)
app.use('/api/order', authMiddleware(['organization']), orderRoutes)
