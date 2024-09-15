const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/transfer', (req, res) => {
  const { from_account_id, to_account_id, transfer_amt } = req.body;

  // First, deduct from sender's account
  const deductQuery = `UPDATE accounts SET balance = balance - ? WHERE account_id = ?`;
  db.query(deductQuery, [transfer_amt, from_account_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Transfer failed (deduct)' });

    // Then, add to recipient's account
    const addQuery = `UPDATE accounts SET balance = balance + ? WHERE account_id = ?`;
    db.query(addQuery, [transfer_amt, to_account_id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Transfer failed (add)' });

      res.status(200).json({ message: 'Transfer successful' });
    });
  });
});

module.exports = router;
