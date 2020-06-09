const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const requireAuth = require("../middlewares/requireAuth");
const Game = mongoose.model("Game");

router.get("/join", requireAuth, async (req, res) => {
  const games = await Game.find({ activePlayers: 1 })
    .sort("name")
    .select("name");

  res.send(games);
});

router.put("/join", requireAuth, async (req, res) => {
  const game = await Game.findById(req.body.id);

  if (
    game.password === "" ||
    (req.body.password !== undefined &&
      bcrypt.compareSync(req.body.password, game.password))
  ) {
    game.player2Name = req.body.guest;
    game.activePlayers++;
  } else {
    return res.send({ error: "Password is incorrect" });
  }
  await game.save();

  res.send(game._id);
});

router.post("/host", requireAuth, async (req, res) => {
  if (req.body.name === "") return res.send({ error: "Game name is required" });

  let game = await Game.findOne({ name: req.body.name });
  if (game) return res.send({ error: "Game name already exists." });

  game = new Game({
    name: req.body.name,
    password: req.body.password,
  });
  if (game.password !== "") {
    const salt = await bcrypt.genSalt(10);
    game.password = await bcrypt.hash(game.password, salt);
  }

  game.deck = Game.initializeDeck();
  game.player1Name = req.body.host;
  game.activePlayers++;

  await game.save();

  res.send(game._id);
});

router.post("/state", requireAuth, async (req, res) => {
  const game = await Game.findById(req.body.id).select(
    "-name -password -activePlayers -date -_id -__v"
  );

  res.send(game);
});

router.delete("/deleteGame", async (req, res) => {
  Game.findByIdAndRemove(req.body.id, (err, data) => {
    if (err) res.send("Game couldn't be deleted");
    else res.send("Game was deleted");
  });
});

module.exports = router;
