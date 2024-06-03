const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vd@164399',
    database: 'Bank'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

function generateVerificationToken() {
    return crypto.randomBytes(16).toString('hex');
}

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM users WHERE email = ? AND password = ? AND verified = true`;
    connection.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).send('Error during login');
        } else {
            if (result.length > 0) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/error');
            }
        }
    });
});

app.get('/verify', (req, res) => {
    const { token } = req.query;

    const sql = `UPDATE users SET verified = true WHERE verificationToken = ?`;
    connection.query(sql, [token], (err, result) => {
        if (err) {
            console.error('Error during verification:', err);
            res.status(500).send('Error during verification');
        } else {
            if (result.affectedRows > 0) {
                res.redirect('/login');
            } else {
                res.status(400).send('Invalid or expired verification token');
            }
        }
    });
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/public/error.html');
});

app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
});

function generateRandomBalance() {
    return Math.floor(Math.random() * (10000 - 100 + 1)) + 100;
}

app.post('/createAccount', (req, res) => {
    const { accountName, accountType } = req.body;
    const balance = generateRandomBalance();

    const sql = `INSERT INTO accounts (name, type, balance) VALUES (?, ?, ?)`;
    connection.query(sql, [accountName, accountType, balance], (err, result) => {
        if (err) {
            console.error('Error creating account:', err);
            res.status(500).send('Error creating account');
        } else {
            console.log('Account created successfully:', result);
            const accountId = result.insertId;
            const fetchSql = `SELECT * FROM accounts WHERE id = ?`;
            connection.query(fetchSql, [accountId], (fetchErr, fetchResult) => {
                if (fetchErr) {
                    console.error('Error fetching account details:', fetchErr);
                    res.status(500).send('Error fetching account details');
                } else {
                    const accountDetails = fetchResult[0];
                    res.status(200).send(accountDetails);
                }
            });
        }
    });
});

app.post('/register', (req, res) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const verificationToken = generateVerificationToken();

    const sql = `INSERT INTO users (firstName, lastName, email, phoneNumber, password, verificationToken, verified) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [firstName, lastName, email, phoneNumber, password, verificationToken, false], (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).send('Error registering user');
        } else {
            console.log('User registered successfully:', result);
            sendVerificationEmail(email, verificationToken);
            res.status(200).send('A verification email has been sent to your email address.');
        }
    });
});

function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dipakdh12345@gmail.com', // Your Gmail email address
            pass: 'mrfx esco bovl wbzj' // Your Gmail password or app password
        }
    });

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Verify your account',
        text: `Please click the following link to verify your account: http://localhost:3000/verify?token=${token}` // Change the URL as per your application
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
