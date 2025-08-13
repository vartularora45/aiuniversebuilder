// models/BotProject.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// File structure schema (optional)
const fileSectionSchema = new Schema(
  {
    files: {
      type: Map, // Key-value pairs of filename -> content
      of: Schema.Types.Mixed, // Can be string (code), object, etc.
      default: {}
    },
    dependencies: {
      type: Map,
      of: String,
      default: {}
    }
  },
  { _id: false }
);

const botProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    initialPrompt: {
      type: String,
      required: [true, 'Initial prompt is required'],
      maxlength: [1000, 'Initial prompt cannot exceed 1,000 characters']
    },
    category: {
      type: String,
      enum: ['education','ecommerce','healthcare','finance','support','other'],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['draft','in_progress','completed','deployed'],
      default: 'draft'
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],

    // ⭐ ADDED FILE STORAGE FIELDS
    files: {
      frontend: { type: fileSectionSchema, default: () => ({}) },
      backend: { type: fileSectionSchema, default: () => ({}) },
      config: {
        files: {
          type: Map,
          of: Schema.Types.Mixed,
          default: {}
        }
      }
    },

    // Optional: store generated questions
    questions: { type: Array, default: [] },

    // Optional: store metadata from generator
    metadata: { type: Schema.Types.Mixed, default: {} },

    // Whether training data was used
    trainingDataUsed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes for faster look-ups
botProjectSchema.index({ owner: 1, createdAt: -1 });
botProjectSchema.index({ category: 1 });

export default model('BotProject', botProjectSchema);
