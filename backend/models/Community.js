const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
