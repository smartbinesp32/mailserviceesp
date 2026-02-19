require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Added CORS

const app = express();

// Middleware
app.use(cors()); // This allows your HTML file to "fetch" without errors
app.use(express.json());

// 1. Setup Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 2. Health Check (Visit this in browser to wake up Render)
app.get('/', (req, res) => {
  res.send('Bin Reminder Server is Live 🚀');
});

// 3. The Email Sending Route
app.post('/send-email', (req, res) => {
  const { recipient, message } = req.body;

  if (!recipient || !message) {
    return res.status(400).json({ error: 'Recipient and message are required.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: 'Bin Reminder Alert 🗑️',
    html: `
      <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2e7d32;">Don't forget!</h2>
        <p style="font-size: 1.1em;">Today is the collection day for: <b>${message}</b></p>
        <hr>
        <small style="color: #888;">Automated Bin Reminder Service</small>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Nodemailer Error:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  });
});

// 4. Port Configuration for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server active on port ${PORT}`);
});