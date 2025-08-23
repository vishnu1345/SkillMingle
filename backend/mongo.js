require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGOOSE_CONNECTION)
  .then(() => {
    console.log("mongodb connect");
  })
  .catch(() => {
    console.log("failed");
  });

const applicationSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  location: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  contact: String,
  experience: [String],
  projects: [String],
  skills: [Number],
  achievements: String,
  certifications: [String],
  skillLevels: { type: Map, of: String },
  matchedJobTitle: String,
  applications: [applicationSchema],
});

const collection = mongoose.model("collection", newSchema);

module.exports = collection;
