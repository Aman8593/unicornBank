const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    console.log('Received POST request at /register');
    console.log('Request body:', req.body);

    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
        console.log('Missing fields');
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newUser = { firstName, lastName, email, phoneNumber, password }; // Include password in newUser object
    db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    });
});

module.exports = router;
