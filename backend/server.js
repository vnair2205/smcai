// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- DB Connection ---
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// --- New Code for API Routes ---
const coursesRouter = require('./routes/courses');
app.use('/courses', coursesRouter);
// --- End of New Code ---

// A simple route for testing
app.get('/', (req, res) => {
  res.send('SeekMYCOURSE Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// ... (other imports)

// --- Add this line with your other routes ---
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// ... (rest of the server.js file)
