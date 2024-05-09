const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/dbconnect.js');
require('dotenv').config();

// Database connection
connectDB();
app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

const userRoutes = require('./routes/user.js');
const storyRoutes = require('./routes/story.js');

app.use('/api/users', userRoutes);
app.use('/api/stories' ,storyRoutes);


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

