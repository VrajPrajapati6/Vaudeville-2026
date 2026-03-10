require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
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

// Global error handler for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ error: 'Malformed JSON in request body.' });
  }
  next();
});

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
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
    slug: 'escape-rooms', title: 'Escape the Black Pearl',
    desc: 'Solve puzzles and find your way out of the room before time runs out.',
    description: 'An immersive experience where teams are locked in a room and must solve a series of themed puzzles, riddles, and clues to escape within the time limit. Teamwork and quick thinking are essential.',
    rules: ['Team size: 4 members', 'Time limit: 60 minutes', 'No personal electronic devices allowed inside'],
    teamSize: '4', prize: '₹10,000',
  },
  {
    slug: 'treasure-hunt', title: 'The Lost Treasure',
    desc: 'Navigate campus to find hidden clues and uncover the final treasure.',
    description: 'Teams must decode clues spread across the entire campus. Each clue leads to the next location. The team to reach the final treasure point first claims the prize.',
    rules: ['Team size: 3-4 members', 'Follow clues across campus strictly', 'No external help or vehicles allowed'],
    teamSize: '3–4', prize: '₹10,000',
  },
  {
    slug: 'gully-cricket', title: 'The Seven-Seas Cricket League',
    desc: 'A fast-paced, high-energy adaptation of real-world street cricket.',
    description: 'Experience the thrill of traditional street cricket with quick matches, specialized gully rules, and pure fun. Knockouts leading to the grand final.',
    rules: ['Team size: 6 players on field', 'Tennis ball usage', 'Specific "out" zones depending on venue'],
    teamSize: '6', prize: '₹10,000',
  },
  {
    slug: 'dance', title: 'Kraken\'s da-da Dance',
    desc: 'Solo-Classical, Solo-Western, Duet, and Group dance styles.',
    teamSize: '1-10', prize: '₹10,000',
  },
  {
    slug: 'music', title: 'Harmony of the Seas',
    desc: 'Singing (Solo, Duet, Group).',
    teamSize: '1-10', prize: '₹10,000',
  },
  {
    slug: 'e-sports', title: 'Deadman\'s Arena',
    desc: 'Valorant, BGMI, FIFA, Clash Royale competitive brackets.',
    teamSize: 'Solo to 6', prize: '₹12,000',
  },
  {
    slug: 'fashion-walk', title: 'Sailor\'s Disguise',
    desc: 'Strut the runway in spectacular fashion or cosplay.',
    teamSize: 'Solo / Group', prize: '₹15,000',
  },
  {
    slug: 'literary', title: 'Pirate\'s Parliament',
    desc: 'Debate and Elocution competitions for the eloquent minds.',
    teamSize: 'Solo / Duet', prize: '₹5,000',
  },
  {
    slug: 'open-mic', title: 'Voices of the Voyage',
    desc: 'Poetry, Shayari, Comedy, Storytelling, and Mimicry.',
    teamSize: 'Solo', prize: '₹5,000',
  },
  {
    slug: 'fine-arts', title: 'Art of the Tides',
    desc: 'Tote Bag painting, traditional Mehendi, and Rangoli competitions.',
    teamSize: 'Solo', prize: '₹5,000',
  },
  {
    slug: 'fireless-cooking', title: 'Captain\'s Kitchen',
    desc: 'Whip up delicious cuisine without the use of a stove or oven.',
    teamSize: '2-4', prize: '₹5,000',
  },
  {
    slug: 'instrumental-solo', title: 'The Coral Riff',
    desc: 'Showcase your mastery over musical instruments.',
    teamSize: 'Solo', prize: '₹5,000',
  },
  {
    slug: 'street-dance', title: 'Raider\'s Duel',
    desc: 'Bring the rhythm of the streets to the pirate\'s deck in this solo dance battle.',
    teamSize: 'Solo', prize: '₹5,000',
  },
  {
    slug: 'cosplay', title: 'The Abyss Walker',
    desc: 'Showcase your pirate-themed costume on the grand stage.',
    teamSize: 'Solo', prize: '₹10,000',
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
    const { eventId, game, ingredients, teamName, members } = req.body;

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
    const leaderInstitute = members[0].institute;
    const normalizedMembers = members.map((m, idx) => ({ 
      ...m, 
      institute: (eventId === 'gully-cricket' || idx === 0) ? m.institute : leaderInstitute,
      rollNo: m.rollNo.toLowerCase() 
    }));
    const newRegistration = new RegModel({ game, ingredients, teamName, members: normalizedMembers });
    await newRegistration.save();

    // ── Append to Google Sheet ──
    const sheetMembers = normalizedMembers.map(m => ({
      name: m.name,
      rollNumber: m.rollNo,
      mobileNumber: m.mobileNo, // Standardized key
      institute: m.institute,
      branch: m.branch,
      ugPg: m.ugPg,
      gender: m.gender,
      studentFaculty: m.studentFaculty,
      preference: m.preference || 'N/A',
      habit: m.habit || 'N/A',
      rank: m.rank || 'N/A'
    }));

    await appendToGoogleSheet({
      type: 'registration',
      eventId,
      game: game || 'N/A',
      ingredients: ingredients || 'N/A',
      teamName: teamName || 'N/A',
      members: sheetMembers,
      registeredAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    });

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

module.exports = app;
