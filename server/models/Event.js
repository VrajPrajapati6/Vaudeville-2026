const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true },
  title:       { type: String, required: true },
  desc:        { type: String },
  description: { type: String },
  rules:       [{ type: String }],
  teamSize:    { type: String },
  prize:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
