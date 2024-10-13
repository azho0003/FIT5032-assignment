const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const cors = require("cors")({origin: true});
const axios = require("axios");

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

admin.initializeApp();

/**
 * Cloud Function to send emails using SendGrid.
 */
exports.sendEmail = functions.https.onRequest((req, res) => {
  // Handle CORS
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const {to, from, subject, html, attachments} = req.body;

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

/**
 * Cloud Function to search places using Mapbox Geocoding API.
 */
exports.mapboxSearch = functions.https.onRequest(async (req, res) => {
  // Handle CORS
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const query = req.query.query;

    if (!query) {
      return res.status(400).send({error: "Missing query parameter."});
    }

    const MAPBOX_TOKEN = functions.config().mapbox.token;
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`;

    try {
      const response = await axios.get(endpoint);
      const features = response.data.features.map((feature) => ({
        placeName: feature.place_name,
        coordinates: feature.geometry.coordinates,
      }));
      return res.status(200).send({results: features});
    } catch (error) {
      console.error("Error fetching geocoding data:", error.response ?
        error.response.data : error.message);
      return res.status(500).send({error: "Failed to fetch geocoding data."});
    }
  });
});

/**
 * Cloud Function to get directions using Mapbox Directions API.
 */
exports.mapboxDirections = functions.https.onRequest(async (req, res) => {
  // Handle CORS
  cors(req, res, async () => {
    if (req.method !== "GET") {
      return res.status(405).send({error: "Method Not Allowed"});
    }

    const {start, end} = req.query;

    if (!start || !end) {
      return res.status(400)
          .send({error: "Missing start or end parameters."});
    }

    const MAPBOX_TOKEN = functions.config().mapbox.token;
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${MAPBOX_TOKEN}&steps=true`;

    try {
      const response = await axios.get(endpoint);
      const routes = response.data.routes.map((route) => ({
        distance: route.distance,
        duration: route.duration,
        geometry: route.geometry,
      }));
      return res.status(200).send({routes});
    } catch (error) {
      console.error("Error fetching directions data:",
        error.response ? error.response.data : error.message);
      return res.status(500).send({error: "Failed to fetch directions data."});
    }
  });
});
