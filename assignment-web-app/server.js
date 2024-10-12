import 'dotenv/config';  // For accessing environment variables securely
import express from 'express';
import sendgridMail from '@sendgrid/mail';
import multer from 'multer';
import fs from 'fs';

sendgridMail.setApiKey('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');

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/'});

app.post('/api/send-email', upload.single('attachment'), async(req,res) => {
    const { email, subject, message } = req.body;
    const attachmentPath = req.file ? fs.readFileSync(req.file.path).toString('base64') : null

    const msg = {
        to: email,
        from: 'alexzhou0306@gmail.com',
        subject,
        text: message,
        attachments: attachmentPath ? [{
            content: attachmentPath,
            filename: req.file.originalname,
            type: req.file.mimetype,
            disposition: 'attachment',
        }]
        : [],
    }

    try {
        await sendgridMail.send(msg);
        res.json({ message: "Email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});