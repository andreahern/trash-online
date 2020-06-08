import axios from "axios";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export const host = async (newGame) => {
  const { username } = jwt_decode(localStorage.token);

  const response = await axios.post(
    "/host",
    {
      host: username,
      name: newGame.gameName,
      password: newGame.password,
    },
    { headers: { Authorization: localStorage.token } }
  );

  localStorage.setItem("gametoken", response.data);
  return response.data;
};

export const find = async () => {
  return await axios.get("/join", {
    headers: { Authorization: localStorage.token },
  });
};

export const join = async (newUser) => {
  const { username } = jwt_decode(localStorage.token);
  const response = await axios.put(
    "/join",
    {
      guest: username,
      id: newUser.id,
      password: newUser.password,
    },
    { headers: { Authorization: localStorage.token } }
  );
  localStorage.setItem("gametoken", response.data);
  return response.data;
};

export const getState = async (data) => {
  const response = await axios.post("/state", data, {
    headers: { Authorization: localStorage.token },
  });
  return response.data;
};

export const deal = async (id, state) => {
  await socket.emit("deal", { id, state });
};

export const draw = async (id, state) => {
  await socket.emit("draw", { id, state });
};

export const take = async (id, state) => {
  await socket.emit("take", { id, state });
};

export const roundWon = async (id, playerWon, state) => {
  await socket.emit("roundWon", { id, playerWon, state });
};

export const end = async (id, state) => {
  await socket.emit("endTurn", { id, state });
};

export const swapCards = async (id, index, state) => {
  await socket.emit("swap", { id, index, state });
};
export const reset = async (id, state) => {
  await socket.emit("reset", { id, state });
};

export const scores = async (playerNumber, playerWon) => {
  await axios.put(
    "/scores",
    {
      playerNumber,
      playerWon,
    },
    {
      headers: { Authorization: localStorage.token },
    }
  );
};
