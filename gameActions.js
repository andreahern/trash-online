const mongoose = require("mongoose");
const Game = mongoose.model("Game");

const dealCards = async (state) => {
  let cardsLeftForPlayer1 = state.player1Size;
  let cardsLeftForPlayer2 = state.player2Size;
  let player1Cards = state.player1Cards;
  let player2Cards = state.player2Cards;
  let deck = state.deck;
  let max = Math.max(cardsLeftForPlayer1, cardsLeftForPlayer2);

  for (let i = 0; i < max; i++) {
    if (cardsLeftForPlayer1 > 0) {
      player1Cards[i] = deck.shift();
      cardsLeftForPlayer1--;
    }
    if (cardsLeftForPlayer2 > 0) {
      player2Cards[i] = deck.shift();
      cardsLeftForPlayer2--;
    }
  }

  return { deck, player1Cards, player2Cards, gameInSession: true };
};

const drawCard = async (state) => {
  let deck = state.deck;
  if (deck.length === 0) return;
  let hand = deck.shift();

  return { deck, hand, playerPlaying: true };
};

const takeTrash = async (state) => {
  let trash = state.trash;
  let hand = trash.pop();

  return { trash, hand, playerPlaying: true };
};

const endTurn = async (state) => {
  let trash = state.trash;
  trash = trash.concat(state.hand);

  return {
    hand: "",
    trash,
    currentPlayer: state.currentPlayer * -1,
    playerPlaying: false,
  };
};

const roundWon = async (playerWon, state) => {
  if (playerWon === 1) {
    state.player1Size--;

    return {
      player1Size: state.player1Size,
      playerWon: 1,
    };
  } else {
    state.player2Size--;

    return {
      player2Size: state.player2Size,
      playerWon: -1,
    };
  }
};

const reset = async (state) => {
  deck = Game.initializeDeck();
  hand = "";
  trash = [];
  currentPlayer = 1;
  gameInSession = false;
  playerPlaying = false;
  player1Cards = [];
  player2Cards = [];
  player1Flipped = new Array(state.player1Size).fill(0);
  player2Flipped = new Array(state.player2Size).fill(0);
  playerWon = 0;

  return {
    deck,
    hand,
    trash,
    currentPlayer,
    gameInSession,
    playerPlaying,
    player1Cards,
    player2Cards,
    player1Flipped,
    player2Flipped,
    playerWon,
  };
};

const swap = async (index, state) => {
  if (state.currentPlayer === 1) {
    let player1Cards = state.player1Cards;
    let newHand = player1Cards[index];
    player1Cards[index] = state.hand;

    let player1Flipped = state.player1Flipped;
    player1Flipped[index] = 1;

    return { player1Cards, hand: newHand, player1Flipped };
  } else {
    let player2Cards = state.player2Cards;
    let newHand = player2Cards[index];
    player2Cards[index] = state.hand;

    let player2Flipped = state.player2Flipped;
    player2Flipped[index] = 1;

    return { player2Cards, hand: newHand, player2Flipped };
  }
};

module.exports = {
  dealCards,
  drawCard,
  takeTrash,
  endTurn,
  roundWon,
  reset,
  swap,
};
