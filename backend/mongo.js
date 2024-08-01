const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/techweek")
  .then(() => {
    console.log("mongodb connect");
  })
  .catch(() => {
    console.log("failed");
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
  skills: [String],
  achievements: String,
  certifications: [String],
});

const collection = mongoose.model("collection", newSchema);

module.exports = collection;