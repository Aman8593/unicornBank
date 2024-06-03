const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { acc_name, account_type, user_id } = req.body;

    // Check if all required fields are provided
    if (!acc_name || !account_type || !user_id) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const newAccount = { acc_name, account_type, user_id };
    db.query('INSERT INTO accounts SET ?', newAccount, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json({ message: 'Account created successfully' });
    });
});

module.exports = router;
