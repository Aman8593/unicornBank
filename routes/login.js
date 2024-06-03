const express = require('express');
const router = express.Router();
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
connection.connect();

// POST route for handling login
router.post('/', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;

    connection.query(query, [email, password], (error, results, fields) => {
        if (error) {
            console.error('Error executing MySQL query:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            // Valid credentials, redirect to dashboard
            res.redirect('/dashboard');
        } else {
            // Invalid credentials, redirect to error page
            res.redirect('/error.html');
        }
    });
});

module.exports = router;
