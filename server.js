require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// schema
const UserSearch = mongoose.model('UserSearch', new mongoose.Schema({
    username: String,
    timestamp: { type: Date, default: Date.now }
}));

// simple route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// main API endpoint
app.post('/api/user', async (req, res) => {
    const { username } = req.body;
    console.log("Received request with username:", username);

    if (!username) return res.status(400).json({ error: 'Username is required' });

    try {
        await UserSearch.create({ username });
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Failed to fetch from LeetCode API');

        const data = await response.json();
        console.log("Fetched data:", data); // optional: to see what data comes
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
