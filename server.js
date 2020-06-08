require("./models/User");
require("./models/Game");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const cors = require("cors");
require("dotenv").config();
const requireAuth = require("./middlewares/requireAuth");
const {
  dealCards,
  drawCard,
  takeTrash,
  endTurn,
  roundWon,
  reset,
  swap,
} = require("./gameActions");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(gameRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build/"));
}

const MongoURI = process.env.MongoURI;
const PORT = process.env.PORT || 8080;

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connection to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your username is: ${req.user.username}`);
});

io.on("connection", (socket) => {
  socket.on("joinGame", ({ id, username }) => {
    socket.join(id);
    if (io.sockets.adapter.rooms[id].length < 2) {
      io.sockets.adapter.rooms[id].player1Name = username;
      io.sockets.in(id).emit("showConnections", {
        activePlayers: io.sockets.adapter.rooms[id].length,
        player1Name: username,
      });
    } else
      io.sockets.in(id).emit("showConnections", {
        activePlayers: io.sockets.adapter.rooms[id].length,
        player1Name: io.sockets.adapter.rooms[id].player1Name,
        player2Name: username,
      });
  });

  socket.on("deal", async ({ id, state }) => {
    response = await dealCards(state);
    io.sockets.in(id.id).emit("dealResponse", response);
  });

  socket.on("draw", async ({ id, state }) => {
    response = await drawCard(state);
    io.sockets.in(id.id).emit("drawResponse", response);
  });

  socket.on("take", async ({ id, state }) => {
    response = await takeTrash(state);
    io.sockets.in(id.id).emit("takeResponse", response);
  });

  socket.on("endTurn", async ({ id, state }) => {
    response = await endTurn(state);
    io.sockets.in(id.id).emit("endTurnResponse", response);
  });

  socket.on("roundWon", async ({ id, playerWon, state }) => {
    response = await roundWon(playerWon, state);

    io.sockets.in(id.id).emit("roundWonResponse", response);
  });

  socket.on("swap", async ({ id, index, state }) => {
    response = await swap(index, state);
    io.sockets.in(id.id).emit("swapResponse", response);
  });

  socket.on("reset", async ({ id, state }) => {
    response = await reset(state);
    io.sockets.in(id.id).emit("resetResponse", response);
  });

  socket.on("init", async ({ id }) => {
    response = await init();
    io.sockets.in(id.id).emit("initResponse", response);
  });

  socket.on("disconnect", () => socket.removeAllListeners());
});

io.listen(3002);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
