import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true }, // prix mensuel en $
  priceYear: { type: Number, required: true }, // prix annuel en $
  credits: { type: Number, required: true }, // crédits/mois
  features: [{ type: String }],
  highlight: { type: Boolean, default: false },
  access: {
    team: { type: Boolean, default: false },
    mediaScript: { type: Boolean, default: false },
    proScript: { type: Boolean, default: false },
    basicScript : { type: Boolean, default: false },
  }
});

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
