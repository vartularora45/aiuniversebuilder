// models/Deployment.js
const mongoose = require('mongoose');

const DeploymentSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
  type: { type: String, enum: ['web', 'slack', 'api', 'custom'] },
  url: { type: String }, // endpoint or embed link
  apiKey: { type: String },
  status: { type: String, enum: ['deployed', 'error', 'inactive'], default: 'deployed' },
  deployedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deployment', DeploymentSchema);
