const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const getRegistrationModel = require('../models/getRegistrationModel');

// Reusable function to call the backend API directly (to test the whole route)
async function testRegistrationRoute(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function verifyIntegrity() {
  console.log('🔍 Starting Deep Integrity Verification...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Connected to MongoDB');

    // CASE 1: Solo Event (Code Arena)
    console.log('\n--- Case 1: Solo Event (Code Arena) ---');
    const soloPayload = {
      eventId: 'code-arena',
      members: [{
        name: 'Solo Warrior',
        rollNo: 'SOLO' + Date.now(),
        year: '3',
        branch: 'CSE',
        institute: 'Technology'
      }]
    };
    
    const soloRes = await testRegistrationRoute(soloPayload);
    console.log('API Status:', soloRes.status);
    console.log('API Response:', soloRes.body.message || soloRes.body.error);

    if (soloRes.status === 201) {
      const RegModel = getRegistrationModel('code-arena');
      const doc = await RegModel.findOne({ 'members.name': 'Solo Warrior' });
      console.log('✅ Found in MongoDB [reg_code-arena]:', doc ? 'YES' : 'NO');
    }

    // CASE 2: Team Event (Escape Room)
    console.log('\n--- Case 2: Team Event (Escape Room) ---');
    const teamPayload = {
      eventId: 'escape-rooms',
      teamName: 'The Puzzle Solvers',
      members: [
        { name: 'Captain Hook', rollNo: 'CAP' + Date.now(), year: '2', branch: 'ECE', institute: 'Technology' },
        { name: 'Peter Pan', rollNo: 'PET' + Date.now(), year: '2', branch: 'ECE', institute: 'Technology' }
      ]
    };

    const teamRes = await testRegistrationRoute(teamPayload);
    console.log('API Status:', teamRes.status);
    console.log('API Response:', teamRes.body.message || teamRes.body.error);

    if (teamRes.status === 201) {
      const RegModel = getRegistrationModel('escape-rooms');
      const doc = await RegModel.findOne({ teamName: 'The Puzzle Solvers' });
      console.log('✅ Found in MongoDB [reg_escape-rooms]:', doc ? 'YES' : 'NO');
      console.log('✅ Member Count in DB:', doc.members.length);
    }

    console.log('\n🚀 ROUTE VERIFICATION COMPLETE.');
    console.log('Please check your Google Sheet for:');
    console.log('1. A tab named "Code Arena" with 1 new row.');
    console.log('2. A tab named "Escape Rooms" with 2 new rows (both with team name "The Puzzle Solvers").');

  } catch (err) {
    console.error('❌ Verification Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

verifyIntegrity();
