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

app.listen(port, () => {
  console.log("app running ");
});