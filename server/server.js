// server.js
const express = require('express');
const dotenv = require('dotenv');
const titleRoutes = require('./routes/titleRoutes'); // Import title routes
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
// Use the title routes
app.use('/api', titleRoutes);

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
