const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// ✅ Load environment variables first
dotenv.config();

// ✅ Now import connectDB
const connectDB = require('./config/db');
connectDB(); 

const userRoutes = require('./routes/userRoutes');
const rewardRoutes = require('./routes/rewardRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/rewards', rewardRoutes);

// Root route
app.get('/', (req, res) => res.send('LoyalBox API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server 🏃 on port ${PORT}`));
