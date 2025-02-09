const express = require('express');
const path = require('path');
const pool = require('./db'); // Use the shared database module

const app = express();
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get total users count
app.get('/total-users', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS count FROM users');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint to search users by country
app.get('/search-users', async (req, res) => {
    const { country } = req.query;
    try {
        const result = await pool.query(
            'SELECT name, email, country FROM users WHERE country ILIKE $1',
            [`%${country}%`]
        );
        res.json(result.rows); // Send the filtered results
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(4000, () => {
    console.log('Users Dashboard is running on port 4000');
});
