// models/EventAnalytics.js
const mongoose = require('mongoose');

const EventAnalyticsSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  type: { type: String }, // e.g., 'message', 'session'
  meta: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventAnalytics', EventAnalyticsSchema);
