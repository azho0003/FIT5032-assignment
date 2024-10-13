import express from 'express';
import multer from 'multer';
import sendGridMail from '@sendgrid/mail';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import cors from 'cors';
import admin from './src/firebase/firebaseAdmin.js';

// Load environment variables from .env file
dotenv.config();

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // Allow requests from the frontend origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    fs.mkdir(uploadPath, { recursive: true })
      .then(() => cb(null, uploadPath))
      .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}-${sanitizedFilename}`);
  },
});

const upload = multer({ storage });

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ') ||
    authHeader.split(' ').length !== 2
  ) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Missing or invalid token.' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

// API endpoint to send email
app.post(
  '/api/send-email',
  authenticate,
  upload.single('attachment'),
  async (req, res) => {
    const { from, to, subject, message } = req.body;

    // Validate required fields
    if (!from || !to || !subject || !message) {
      return res.status(400).json({
        message:
          'Bad Request: From, To, Subject, and Message fields are required.',
      });
    }

    // Validate that the 'from' email matches the authenticated user's email
    if (from !== req.user.email) {
      return res.status(403).json({
        message:
          'Forbidden: The sender email does not match the authenticated user.',
      });
    }

    // Construct the email object
    const email = {
      to,
      from,
      subject,
      text: message,
    };

    // Handle attachment if present
    if (req.file) {
      try {
        const filePath = path.join(process.cwd(), req.file.path);
        const fileContent = await fs.readFile(filePath, { encoding: 'base64' });

        email.attachments = [
          {
            content: fileContent,
            filename: req.file.originalname,
            type: req.file.mimetype,
            disposition: 'attachment',
          },
        ];
      } catch (error) {
        console.error('Error processing attachment:', error);
        return res.status(500).json({
          message: 'Internal Server Error: Failed to process attachment.',
        });
      }
    }

    try {
      await sendGridMail.send(email);

      // Delete the uploaded file after sending the email
      if (req.file) {
        const filePath = path.join(process.cwd(), req.file.path);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Error deleting uploaded file:', err);
          // Continue without failing the request
        }
      }

      return res
        .status(200)
        .json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
      console.error(
        'Error sending email via SendGrid:',
        error.response?.body || error.message
      );
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error: Failed to send email.',
      });
    }
  }
);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found: The requested endpoint does not exist.',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res
    .status(500)
    .json({ message: 'Internal Server Error: An unexpected error occurred.' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
