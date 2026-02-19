require('dotenv').config();
const express = require('express');
const { Resend } = require('resend'); // 1. Import Resend
const cors = require('cors');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY); // 2. Initialize with API Key

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('Bin Reminder API is Live 🚀');
});

// The Email Sending Route
app.post('/send-email', async (req, res) => {
  const { recipient, message } = req.body;

  if (!recipient || !message) {
    return res.status(400).json({ error: 'Recipient and message are required.' });
  }

  try {
    // 3. Send email using Resend API
    const { data, error } = await resend.emails.send({
      from: 'Bin Alert <onboarding@resend.dev>', // Keep as onboarding@resend.dev for free tier
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
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ success: false, error });
    }

    res.status(200).json({ success: true, messageId: data.id });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server active on port ${PORT}`);
});
