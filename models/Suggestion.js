import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["bug", "feature", "improvement", "other"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export default mongoose.models.Suggestion || mongoose.model("Suggestion", SuggestionSchema);
