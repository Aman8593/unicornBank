const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/deposit', (req, res) => {
  const { account_id, deposit_amt } = req.body;

  const query = `UPDATE accounts SET balance = balance + ? WHERE account_id = ?`;
  db.query(query, [deposit_amt, account_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Deposit failed' });
    }
    res.status(200).json({ message: 'Deposit successful' });
  });
});

module.exports = router;
