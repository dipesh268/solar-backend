
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const customerRoutes = require('./routes/customers');

const app = express();
const PORT =5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
  res.send('Solar API is running');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
