const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send({ error: "Must provide username and password" });
  }

  const user = new User({ username, password });

  try {
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username },
      process.env.SECRET_KEY
    );
    res.send({ token });
  } catch (err) {
    return res.send({ error: "Username is already taken" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({ error: "Must provide username and password" });
  }

  const user = await User.findOne({ username });
  if (!user) return res.send({ error: "Invalid password or username" });

  try {
    await user.comparePassword(password);
    const token = jwt.sign(
      { userId: user._id, username },
      process.env.SECRET_KEY
    );
    res.send({ token });
  } catch (err) {
    return res.send({ error: "Invalid password or username" });
  }
});

router.post("/stats", async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);

  return res.send({ wins: user.wins, losses: user.losses });
});

router.put("/scores", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (req.body.playerNumber === req.body.playerWon) user.wins++;
  else user.losses++;

  user.save();

  res.send(user);
});

module.exports = router;
