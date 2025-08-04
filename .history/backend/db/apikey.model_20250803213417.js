import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  openaiKey: String,
  huggingfaceKey: String,
  geminiKey: String
});

export default mongoose.model("APIKey", apiKeySchema);
