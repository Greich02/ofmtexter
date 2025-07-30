import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  googleId: { type: String, required: false, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: "user" },
  onboarding: { type: Object },
  plan: {
    type: Schema.Types.ObjectId,
    ref: "Plan",
    default: null // sera défini à l'inscription
  },
  credits: { type: Number, default: 0 },
  creditsRenewalDate: { type: Date, default: null },
  planHistory: [{
    plan: { type: Schema.Types.ObjectId, ref: "Plan" },
    startDate: Date,
    endDate: Date
  }]
});

const User = models.User || model("User", UserSchema);

export default User;
