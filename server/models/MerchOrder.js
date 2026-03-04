const mongoose = require('mongoose');

const MerchOrderSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  transactionId: { type: String, required: true, unique: true, trim: true },
  mobileNumber:  { type: String, required: true, trim: true },
  rollNumber:    { type: String, required: true, trim: true },
  year:          { type: String, required: true },
  branch:        { type: String, required: true },
  institute:     { type: String, required: true, trim: true },
  size:          { type: String, required: true },
  screenshotUrl: { type: String, required: true },
  status:        { type: String, default: 'pending', enum: ['pending', 'verified', 'rejected'] },
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('MerchOrder', MerchOrderSchema);
