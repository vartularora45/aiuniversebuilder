import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  flowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flow"
  },
  input: String,
  output: String,
  usedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  ipAddress: String
});

export default mongoose.model("Analytics", analyticsSchema);
