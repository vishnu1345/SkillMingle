const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;

const collection = require("./mongo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await collection.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        res.json("exist");
      } else {
        res.json("incorrect");
      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("error");
  }
});

app.get("/signup", (req, res) => {
  res.send("signup page");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const data = {
    email: email,
    password: password,
  };

  try {
    const check = await collection.findOne({ email: email });

    if (check) {
      res.json("exist");
    } else {
      await collection.insertMany([data]);
      res.json("notexist");
    }
  } catch (e) {
    res.json("notexist");
  }
});


// Save resume data
app.post("/resume", async (req, res) => {
  const { email, name, contact, experience, projects, skills, achievements, certifications } = req.body;

  console.log('Received data:', req.body); 

  try {
    const user = await collection.findOneAndUpdate(
      { email: email },
      {
        $set: {
          name: name || "",
          contact: contact || "",
          experience: Array.isArray(experience) ? experience : [experience],
          projects: Array.isArray(projects) ? projects : [projects],
          skills: Array.isArray(skills) ? skills : [skills],
          achievements: achievements || "",
          certifications: Array.isArray(certifications) ? certifications : [certifications],
        },
      },
      { new: true, upsert: true } 
    );

    if (user) {
      res.json({ status: "success", user });
    } else {
      res.json({ status: "user_not_found" });
    }
  } catch (e) {
    res.json({ status: "error", message: e.message });
  }
});


// Get resume data
app.get("/resume", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await collection.findOne({ email: email });
    if (user) {
      res.json({ status: "success", user });
    } else {
      res.json({ status: "user_not_found" });
    }
  } catch (e) {
    res.json({ status: "error", message: e.message });
  }
});




app.listen(port, () => {
  console.log("app running ");
});