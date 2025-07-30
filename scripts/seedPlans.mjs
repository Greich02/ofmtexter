import 'dotenv/config';

import mongoose from "mongoose";
import Plan from "../models/Plan.js";

const MONGODB_URI = process.env.MONGODB_URI;

const plans = [
  {
    name: "Solo",
    price: 5,
    priceYear: 48,
    credits: 5000,
    features: ["~500 générations", "Usage individuel", "Pas de script"],
    highlight: false,
    access: { team: false, mediaScript: false, proScript: false }
  },
  {
    name: "Pro",
    price: 10,
    priceYear: 96,
    credits: 12000,
    features: ["~1200 générations", "Accès génération de scripts", "Usage individuel"],
    highlight: false,
    access: { team: false, mediaScript: false, proScript: true }
  },
  {
    name: "Agence",
    price: 25,
    priceYear: 240,
    credits: 35000,
    features: ["~3500 générations", "Accès équipe (5 membres inclus)", "Scripts illimités"],
    highlight: false,
    access: { team: true, mediaScript: true, proScript: true }
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Plan.deleteMany({});
  await Plan.insertMany(plans);
  console.log("Plans seeded!");
  await mongoose.disconnect();
}

seed();
