import express from 'express';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increase limit if sending large attachments

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// API Endpoint to send email
app.post('/api/send-email', async (req, res) => {
  const { to, from, subject, html, attachments } = req.body;

  if (!to || !from || !subject || !html) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const msg = {
    to,
    from,
    subject,
    html,
    attachments: attachments
      ? attachments.map((att) => ({
          content: att.content,
          filename: att.filename,
          type: att.type,
          disposition: att.disposition,
          content_id: att.content_id,
        }))
      : [],
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
