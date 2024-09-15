const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/payment', (req, res) => {
  const { account_id, beneficiary, beneficiary_account, payment_amt } = req.body;

  const query = `INSERT INTO payments (account_id, beneficiary, beneficiary_account, payment_amt) VALUES (?, ?, ?, ?)`;
  db.query(query, [account_id, beneficiary, beneficiary_account, payment_amt], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Payment failed' });
    }
    res.status(200).json({ message: 'Payment successful', payment_id: result.insertId });
  });
});

module.exports = router;
