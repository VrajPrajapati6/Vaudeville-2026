const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  institute: { type: String }, // Optional for some events
  branch: { type: String, required: true },
  ugPg: { type: String, required: true },
  gender: { type: String, required: true },
  studentFaculty: { type: String, required: true },
  mobileNo: { type: String, required: true },
  preference: { type: String }, // For Cosplay
  habit: { type: String }, // For Fashion Walk
});

const RegistrationSchema = new mongoose.Schema({
  game: { type: String }, // Optional, for E-Sports
  ingredients: { type: String }, // For Captain's Kitchen
  teamName: { type: String }, // Optional, only for team events
  members: {
    type: [MemberSchema],
    required: true,
    validate: [
      { validator: (v) => v.length > 0, message: 'At least one member is required.' },
    ],
  },
  registeredAt: { type: Date, default: Date.now },
});

/**
 * Returns (or reuses) a Mongoose model whose collection is named after the event slug.
 * e.g. slug "code-arena"  →  collection "reg_code-arena"
 */
function getRegistrationModel(slug) {
  const modelName = `Registration_${slug}`;
  const collectionName = `reg_${slug}`;

  // Reuse existing compiled model to avoid OverwriteModelError
  if (mongoose.modelNames().includes(modelName)) {
    return mongoose.model(modelName);
  }

  return mongoose.model(modelName, RegistrationSchema, collectionName);
}

module.exports = getRegistrationModel;
