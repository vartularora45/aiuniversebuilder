import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  title: String,
  description: String,
  blocks: Array,
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("Template", templateSchema);
