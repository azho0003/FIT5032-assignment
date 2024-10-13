/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

admin.initializeApp();

/**
 * Cloud Function to send emails using SendGrid.
 * Triggered via HTTPS POST request.
 */
exports.sendEmail = functions.https.onRequest((req, res) => {
  // Handle CORS
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const {to, from, subject, html, attachments} = req.body;

    // Basic Validation
    if (!to || !from || !subject || !html) {
      return res.status(400).send({error: "Missing required fields."});
    }

    // Construct the message
    const msg = {
      to,
      from,
      subject,
      html,
      attachments: attachments ?
        attachments.map((att) => ({
          content: att.content,
          filename: att.filename,
          type: att.type,
          disposition: att.disposition,
          content_id: att.content_id,
        })) :
        [],
    };

    try {
      await sgMail.send(msg);
      return res.status(200).send({success: true});
    } catch (error) {
      console.error("Error sending email:", error.response ?
        error.response.body : error.message);
      return res.status(500).send({success: false,
        error: "Failed to send email."});
    }
  });
});
