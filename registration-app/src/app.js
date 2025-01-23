const express = require('express');
const path = require('path');
const app = express();
const pool = require('./db');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this to parse form data

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Retry mechanism for creating the 'users' table
const retryCreateTable = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const query = `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    country VARCHAR(100) NOT NULL
                );
            `;
            await pool.query(query);
            console.log('Users table ensured in database.');
            return; // Exit function if successful
        } catch (err) {
            console.error(`Attempt ${i + 1}: Error creating users table:`, err.message);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
            } else {
                throw new Error('Failed to ensure users table after retries');
            }
        }
    }
};

// Ensure the table is created when the server starts
retryCreateTable()
    .then(() => console.log('Database setup complete.'))
    .catch(err => {
        console.error('Critical error during table creation:', err.message);
        process.exit(1); // Exit the process if table creation fails
    });

// Route to handle registration form submission
app.post('/register', async (req, res) => {
    const { name, email, country } = req.body;
    console.log('Received data:', req.body); // Debug incoming data

    if (!name || !email || !country) {
        return res.status(400).send('Missing required fields');
    }

    try {
        await pool.query(
            'INSERT INTO users (name, email, country) VALUES ($1, $2, $3)',
            [name, email, country]
        );
        //res.json({ message: 'User registered successfully' });

        // Send success message as a response that can be used in frontend
        res.send('<h3 style="text-align: center;">User registered successfully!</h3>');

    } catch (err) {
        console.error('Error inserting data:', err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});

// Route to view all registered users
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows); // Send the rows as a JSON response
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
