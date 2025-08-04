import mongoose from "mongoose";

const blockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["input", "gpt", "output", "custom"],
    required: true
  },
  model: String,          // e.g., gpt-4, mistral, gemini
  prompt: String,         // used in gpt block
  field: String,          // used in input block
  config: Object          // any custom settings
}, { _id: false });

const flowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  blocks: [blockSchema],   // full flow structure

  isPublic: {
    type: Boolean,
    default: false
  },

  deployedUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

export default mongoose.model("Flow", flowSchema);
