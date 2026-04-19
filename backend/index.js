const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Routes
const authRoute = require('./routes/auth');
const recordRoute = require('./routes/records');

// 1. Initialize Dotenv first to ensure MONGO_URL is available
dotenv.config();

// 2. Initialize the App (This fixes your ReferenceError)
const app = express();

// 3. Middlewares (Set limits BEFORE routes)
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. Database Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("CureMap DB Connected Successfully"))
    .catch((err) => {
        console.error("MongoDB Connection Error:");
        console.log(err);
    });

// 5. Routes (Removed duplicates for cleaner performance)
app.use('/api/auth', authRoute);
app.use('/api/records', recordRoute);

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`CureMap Backend is running on port ${PORT}`);
});