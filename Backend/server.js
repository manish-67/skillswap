require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');
const requestRoutes = require('./routes/requestRoutes');
const messageRoutes = require('./routes/messageRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Import notification routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/notifications', notificationRoutes); // Add notification routes

// Custom Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));