import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: String,
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "editor"
    }
  }]
});

export default mongoose.model("Team", teamSchema);
