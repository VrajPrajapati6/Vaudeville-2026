require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const https = require('https');
const { v2: cloudinary } = require('cloudinary');

const Event = require('./models/Event');
const getRegistrationModel = require('./models/getRegistrationModel');
const MerchOrder = require('./models/MerchOrder');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer (memory storage — file is uploaded to Cloudinary, not disk) ────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

// ── Google Apps Script webhook helper ────────────────────────────────────────
// Node's built-in fetch converts POST → GET on 302 redirects (Apps Script does this).
// We manually follow the redirect with https, keeping POST method.
function appendToGoogleSheet(data) {
  return new Promise((resolve) => {
    const url = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!url || url === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
      console.warn('Google Apps Script URL not set — skipping sheet update.');
      return resolve();
    }

    const body = JSON.stringify(data);

    // Step 1: POST to exec URL → triggers doPost() on Apps Script
    // Apps Script always responds with 302 → script.googleusercontent.com
    // Step 2: GET that redirect URL to retrieve the response
    function getFrom(targetUrl) {
      const parsed = new URL(targetUrl);
      const req = https.request(
        { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'GET' },
        (res) => {
          if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
            return getFrom(res.headers.location);
          }
          let raw = '';
          res.on('data', (chunk) => (raw += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(raw);
              if (!json.success) console.error('Apps Script returned error:', json);
              else console.log('✅ Google Sheet updated successfully.');
            } catch (_) {
              console.error('Apps Script response parse error. Raw:', raw.slice(0, 300));
            }
            resolve();
          });
        }
      );
      req.on('error', (err) => { console.error('Google Sheets GET error:', err.message); resolve(); });
      req.end();
    }

    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      // Drain the POST response body (required before following redirect)
      res.resume();
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        return getFrom(res.headers.location);
      }
      // Unexpected: no redirect — read directly
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (!json.success) console.error('Apps Script returned error:', json);
          else console.log('✅ Google Sheet updated successfully.');
        } catch (_) {
          console.error('Apps Script response parse error. Raw:', raw.slice(0, 300));
        }
        resolve();
      });
    });
    req.on('error', (err) => { console.error('Google Sheets POST error:', err.message); resolve(); });
    req.write(body);
    req.end();
  });
}

// ── Static event catalogue (mirrors client/src/data/eventsData.ts) ────────────
const EVENT_CATALOGUE = [
  {
    slug: 'treasure-hunt', title: 'Treasure Hunt',
    desc: 'Solve riddles hidden across the campus and uncover the lost treasure.',
    description: 'Teams must follow clues spread across the campus. Each clue leads to another location. The fastest team to reach the final treasure wins.',
    rules: ['Team size: 2–4 members', 'Follow clues across campus', 'No external help allowed', 'Decision of judges is final'],
    teamSize: '2–4', prize: '₹10,000',
  },
  {
    slug: 'code-arena', title: 'Code Arena',
    desc: 'Battle with logic and algorithms in an intense coding duel.',
    description: 'Participants solve algorithmic problems under time pressure. The highest score wins.',
    rules: ['Individual participation', 'Languages allowed: C, C++, Java, Python', '3 rounds of coding'],
    teamSize: 'Solo', prize: '₹15,000',
  },
  {
    slug: 'circuit-clash', title: 'Circuit Clash',
    desc: 'Design and debug electronic circuits before time runs out.',
    description: 'Participants must build and troubleshoot circuits using provided components.',
    rules: ['Team of 2 allowed', 'Components provided on spot', 'Working circuit required'],
    teamSize: '2', prize: '₹8,000',
  },
  {
    slug: 'robo-wars', title: 'Robo Wars',
    desc: 'Bring your robot and battle in the arena.',
    description: 'Robots compete in a controlled arena where the last robot standing wins.',
    rules: ['Max weight 15kg', 'No destructive weapons', 'Remote controlled robots allowed'],
    teamSize: '2–5', prize: '₹20,000',
  },
  {
    slug: 'tech-quiz', title: 'Tech Quiz',
    desc: 'Test your knowledge across multiple technical domains.',
    description: 'A quiz competition covering technology, engineering, and science.',
    rules: ['Teams of 2', 'Multiple rounds', 'Rapid fire included'],
    teamSize: '2', prize: '₹5,000',
  },
  {
    slug: 'hackathon', title: 'Hackathon',
    desc: '24 hour coding marathon to build innovative solutions.',
    description: 'Participants build projects within 24 hours and present them to judges.',
    rules: ['Teams of 2–4', 'Prototype required', 'Presentation required'],
    teamSize: '2–4', prize: '₹50,000',
  },
  {
    slug: 'design-duel', title: 'Design Duel',
    desc: 'Compete in UI/UX and graphic design challenges.',
    description: 'Participants design creative UI/UX interfaces within a limited time.',
    rules: ['Individual participation', 'Tools allowed: Figma, Adobe XD'],
    teamSize: 'Solo', prize: '₹7,000',
  },
  {
    slug: 'gaming-arena', title: 'Gaming Arena',
    desc: 'Compete in esports tournaments with fellow gamers.',
    description: 'Multiplayer gaming competition featuring popular esports titles.',
    rules: ['Team based tournament', 'Knockout rounds'],
    teamSize: '5', prize: '₹12,000',
  },
  {
    slug: 'project-expo', title: 'Project Expo',
    desc: 'Showcase innovative engineering projects.',
    description: 'Students present their technical projects to judges.',
    rules: ['Project demonstration required', 'Evaluation based on innovation'],
    teamSize: '1–4', prize: '₹10,000',
  },
  {
    slug: 'ai-challenge', title: 'AI Challenge',
    desc: 'Solve machine learning challenges.',
    description: 'Participants build AI models to solve real-world datasets.',
    rules: ['Python recommended', 'Dataset provided'],
    teamSize: '1–3', prize: '₹18,000',
  },
  {
    slug: 'debugging-contest', title: 'Debugging Contest',
    desc: 'Find and fix bugs in complex codebases.',
    description: 'Participants must debug faulty programs within a time limit.',
    rules: ['Individual participation', 'Multiple bug levels'],
    teamSize: 'Solo', prize: '₹6,000',
  },
  {
    slug: 'startup-pitch', title: 'Startup Pitch',
    desc: 'Pitch your startup idea to expert judges.',
    description: 'Teams present innovative startup ideas and business models.',
    rules: ['Presentation required', 'Pitch time: 5 minutes'],
    teamSize: '2–4', prize: '₹25,000',
  },
];

// ── DB Connection + event seeding ─────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Upsert every event into the shared "events" collection
    for (const ev of EVENT_CATALOGUE) {
      await Event.findOneAndUpdate(
        { slug: ev.slug },
        ev,
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    console.log(`Events collection synced (${EVENT_CATALOGUE.length} events).`);
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/register  →  saves into per-event collection  reg_<slug>
app.post('/api/register', async (req, res) => {
  try {
    const { eventId, teamName, members } = req.body;

    // Basic validation
    if (!eventId || !members || members.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: eventId and members are required.' });
    }

    // Verify event exists in the events collection
    const event = await Event.findOne({ slug: eventId });
    if (!event) {
      return res.status(404).json({ error: `Event "${eventId}" not found.` });
    }

    // Normalise roll numbers to lowercase
    const submittedRollNos = members.map(m => m.rollNo.toLowerCase());

    // Duplicate check within the same submission
    if (new Set(submittedRollNos).size !== submittedRollNos.length) {
      return res.status(409).json({ error: 'Duplicate roll numbers found in your submission. Each member must have a unique roll number.' });
    }

    // Get the per-event registration collection  →  reg_<eventId>
    const RegModel = getRegistrationModel(eventId);

    // Check roll numbers against existing registrations in this event's collection
    const existing = await RegModel.findOne({ 'members.rollNo': { $in: submittedRollNos } });
    if (existing) {
      const dup = existing.members.find(m => submittedRollNos.includes(m.rollNo.toLowerCase()));
      return res.status(409).json({ error: `Roll number "${dup?.rollNo}" is already registered for this event.` });
    }

    // Save to the event-specific collection
    const normalizedMembers = members.map(m => ({ ...m, rollNo: m.rollNo.toLowerCase() }));
    const newRegistration = new RegModel({ teamName, members: normalizedMembers });
    await newRegistration.save();

    res.status(201).json({ message: 'Registration successful!', registration: newRegistration });
  } catch (error) {
    console.error('Registration API Error:', error);
    res.status(500).json({ error: 'Failed to complete registration. Please try again.' });
  }
});

// GET /api/events  →  list all events
app.get('/api/events', async (_req, res) => {
  try {
    const events = await Event.find({}, '-__v').lean();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// GET /api/events/:slug/registrations  →  all registrations for one event
app.get('/api/events/:slug/registrations', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ error: 'Event not found.' });

    const RegModel = getRegistrationModel(req.params.slug);
    const registrations = await RegModel.find({}).lean();
    res.json({ event: event.title, count: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// POST /api/merch/order  →  Cloudinary upload + MongoDB + Google Sheets
app.post('/api/merch/order', upload.single('screenshot'), async (req, res) => {
  try {
    const { name, transactionId, mobileNumber, rollNumber, year, branch, institute, size } = req.body;

    // ── Field validation ──────────────────────────────────────────────────────
    if (!name || !transactionId || !mobileNumber || !rollNumber || !year || !branch || !institute || !size) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      return res.status(400).json({ error: 'Mobile number must be exactly 10 digits.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required.' });
    }

    // ── Duplicate transaction ID check ────────────────────────────────────────
    const existing = await MerchOrder.findOne({ transactionId: transactionId.trim() });
    if (existing) {
      return res.status(409).json({ error: 'This transaction ID has already been submitted.' });
    }

    // ── Upload screenshot to Cloudinary ───────────────────────────────────────
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'vaudeville-merch', resource_type: 'image' },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(req.file.buffer);
    });
    const screenshotUrl = uploadResult.secure_url;

    // ── Save to MongoDB ───────────────────────────────────────────────────────
    const order = new MerchOrder({
      name: name.trim(),
      transactionId: transactionId.trim(),
      mobileNumber: mobileNumber.trim(),
      rollNumber: rollNumber.trim(),
      year,
      branch,
      institute: institute.trim(),
      size,
      screenshotUrl,
    });
    await order.save();

    // ── Append to Google Sheet via Apps Script webhook ──────────────────
    await appendToGoogleSheet({
      name: name.trim(),
      transactionId: transactionId.trim(),
      mobileNumber: mobileNumber.trim(),
      rollNumber: rollNumber.trim(),
      year,
      branch,
      institute: institute.trim(),
      size,
      screenshotUrl,
    });

    res.status(201).json({ message: 'Order submitted successfully! We will verify your payment shortly.' });
  } catch (error) {
    console.error('Merch Order Error:', error);
    res.status(500).json({ error: 'Failed to submit order. Please try again.' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
