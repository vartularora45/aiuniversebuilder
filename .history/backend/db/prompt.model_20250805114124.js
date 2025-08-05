import mongoose from 'mongoose';

// Schema constants for better maintainability
const NODE_TYPES = ['start', 'question', 'condition', 'action', 'end'];
const ANSWER_TYPES = ['text', 'number', 'boolean', 'choice', 'email', 'phone'];

// Node schema with enhanced validation
const nodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Node ID is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Node type is required'],
    enum: {
      values: NODE_TYPES,
      message: `Node type must be one of: ${NODE_TYPES.join(', ')}`
    }
  },
  data: {
    label: {
      type: String,
      trim: true,
      maxlength: [200, 'Label cannot exceed 200 characters']
    },
    question: {
      type: String,
      trim: true,
      maxlength: [1000, 'Question cannot exceed 1000 characters']
    },
    expectedAnswerType: {
      type: String,
      enum: {
        values: ANSWER_TYPES,
        message: `Answer type must be one of: ${ANSWER_TYPES.join(', ')}`
      }
    },
    choices: {
      type: [String],
      validate: {
        validator: function(choices) {
          return !choices || choices.length <= 20;
        },
        message: 'Maximum 20 choices allowed'
      }
    },
    conditions: [{
      field: {
        type: String,
        required: true,
        trim: true
      },
      operator: {
        type: String,
        required: true,
        enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists', 'complete']
      },
      value: mongoose.Schema.Types.Mixed
    }],
    actions: [{
      type: {
        type: String,
        required: true,
        enum: ['send_message', 'store_data', 'api_call', 'generate_response', 'redirect']
      },
      parameters: mongoose.Schema.Types.Mixed
    }]
  },
  position: {
    x: { 
      type: Number, 
      default: 0,
      min: 0
    },
    y: { 
      type: Number, 
      default: 0,
      min: 0
    }
  },
  style: {
    backgroundColor: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
    },
    borderColor: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format']
    },
    width: {
      type: Number,
      min: 50,
      max: 500
    },
    height: {
      type: Number,
      min: 30,
      max: 300
    }
  }
}, { _id: false });

// Edge schema with enhanced validation
const edgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Edge ID is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source node is required'],
    trim: true
  },
  target: {
    type: String,
    required: [true, 'Target node is required'],
    trim: true
  },
  label: {
    type: String,
    trim: true,
    maxlength: [100, 'Edge label cannot exceed 100 characters']
  },
  animated: {
    type: Boolean,
    default: false
  },
  style: {
    stroke: {
      type: String,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid stroke color format']
    },
    strokeWidth: {
      type: Number,
      min: 1,
      max: 10,
      default: 2
    }
  }
}, { _id: false });

// Generated questions schema
const generatedQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  context: {
    type: String,
    trim: true,
    maxlength: [1000, 'Context cannot exceed 1000 characters']
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  answered: {
    type: Boolean,
    default: false
  },
  answer: mongoose.Schema.Types.Mixed,
  answeredAt: Date
}, { _id: false });

// Flow configuration schema
const flowConfigurationSchema = new mongoose.Schema({
  startNodeId: {
    type: String,
    required: [true, 'Start node ID is required'],
    trim: true
  },
  endNodeIds: [{
    type: String,
    trim: true
  }],
  variables: [{
    name: {
      type: String,
      required: true,
      trim: true,
      match: [/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid variable name format']
    },
    type: {
      type: String,
      required: true,
      enum: ANSWER_TYPES
    },
    defaultValue: mongoose.Schema.Types.Mixed,
    description: String
  }],
  metadata: {
    totalNodes: {
      type: Number,
      default: 0
    },
    totalEdges: {
      type: Number,
      default: 0
    },
    category: String,
    complexity: {
      type: String,
      enum: ['simple', 'medium', 'complex'],
      default: 'simple'
    }
  }
}, { _id: false });

// Main prompt flow schema
const promptFlowSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.
