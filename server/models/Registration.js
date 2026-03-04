const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  institute: { type: String, required: true }
});

const RegistrationSchema = new mongoose.Schema({
  eventId: { type: String, required: true, index: true },
  teamName: { type: String }, // Optional, only for team events
  members: {
    type: [MemberSchema],
    required: true,
    validate: [
      {
        validator: function(v) {
          return v.length > 0;
        },
        message: 'A registration must have at least one member.'
      }
    ]
  },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);
