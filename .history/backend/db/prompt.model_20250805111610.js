const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['start', 'question', 'condition', 'action', 'end']
  },
  data: {
    label: String,
    question: String,
    expectedAnswerType: {
      type: String,
      enum: ['text', 'number', 'boolean', 'choice', 'email', 'phone']
    },
    choices: [String],
    conditions: [{
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed
    }],
    actions: [{
      type: String,
      parameters: mongoose.Schema.Types.Mixed
    }]
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  style: {
    backgroundColor: String,
    borderColor: String,
    width: Number,
    height: Number
  }
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  label: String,
  animated: {
    type: Boolean,
    default: false
  },
  style: {
    stroke: String,
    strokeWidth: Number
  }
}, { _id: false });

const promptFlowSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BotProject',
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  generatedQuestions: [{
    question: String,
    context: String,
    priority: Number,
    answered: {
      type: Boolean,
      default: false
    },
    answer: mongoose.Schema.Types.Mixed
  }],
  flowConfiguration: {
    startNodeId: String,
    endNodeIds: [String],
    variables: [{
      name: String,
      type: String,
      defaultValue: mongoose.Schema.Types.Mixed
    }]
  }
}, {
  timestamps: true
});

// Index for better performance
promptFlowSchema.index({ project: 1, version: -1 });

module.exports = mongoose.model('PromptFlow', promptFlowSchema);
