const mongoose = require("mongoose");
const Game = mongoose.model("Game");

const dealCards = async (state) => {
  // const game = await Game.findById(id);

  // let cardsLeftForPlayer1 = game.player1Size;
  // let cardsLeftForPlayer2 = game.player2Size;
  // let player1Cards = game.player1Cards;
  // let player2Cards = game.player2Cards;
  // let deck = game.deck;
  // let max = Math.max(cardsLeftForPlayer1, cardsLeftForPlayer2);

  // for (let i = 0; i < max; i++) {
  //   if (cardsLeftForPlayer1 > 0) {
  //     player1Cards[i] = deck.shift();
  //     cardsLeftForPlayer1--;
  //   }
  //   if (cardsLeftForPlayer2 > 0) {
  //     player2Cards[i] = deck.shift();
  //     cardsLeftForPlayer2--;
  //   }
  // }

  // game.deck = deck;
  // game.player1Cards = player1Cards;
  // game.player2Cards = player2Cards;
  // game.markModified("player1Cards");
  // game.markModified("player2Cards");

  // game.gameInSession = true;

  // await game.save();

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
  // const game = await Game.findById(id);

  // let deck = game.deck;
  // if (deck.length === 0) return;
  // let topCard = deck.shift();

  // game.deck = deck;
  // game.hand = topCard;
  // game.playerPlaying = true;

  // await game.save();

  let deck = state.deck;
  if (deck.length === 0) return;
  let hand = deck.shift();

  return { deck, hand, playerPlaying: true };
};

const takeTrash = async (state) => {
  // const game = await Game.findById(id);

  // let trash = game.trash;
  // let topDiscard = trash.pop();

  // game.trash = trash;
  // game.hand = topDiscard;
  // game.playerPlaying = true;
  // game.markModified("trash");

  // await game.save();

  let trash = state.trash;
  let hand = trash.pop();

  return { trash, hand, playerPlaying: true };
};

const endTurn = async (state) => {
  // const game = await Game.findById(id);
  // let previousPlayer = game.currentPlayer;
  // let trash = game.trash;
  // trash = trash.concat(game.hand);

  // game.hand = "";
  // game.trash = trash;
  // game.markModified("trash");
  // game.currentPlayer = previousPlayer * -1;
  // game.playerPlaying = false;

  // await game.save();

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
  // const game = await Game.findById(id);

  // if (playerWon === 1) {
  //   game.player1Size--;
  //   game.player1Flipped = new Array(game.player1Size).fill(0);
  //   game.playerWon = 1;
  //   game.markModified("player1Size");
  //   game.markModified("player1Flipped");
  //   game.markModified("playerWon");
  //   await game.save();
  //   console.log(1);
  //   return {
  //     player1Size: game.player1Size,
  //     player1Flipped: game.player1Flipped,
  //     playerWon: 1,
  //   };
  // } else {
  //   game.player2Size--;
  //   game.player2Flipped = new Array(game.player2Size).fill(0);
  //   game.markModified("player1Size");
  //   game.markModified("player2Flipped");
  //   game.markModified("playerWon");
  //   game.playerWon = 2;
  //   await game.save();
  //   console.log(2);

  //   return {
  //     player2Size: game.player2Size,
  //     player2Flipped: game.player2Flipped,
  //     playerWon: 2,
  //   };
  // }

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
      playerWon: 2,
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
  // const game = await Game.findById(id);

  //   if (currentPlayer === 1) {
  //     let player1Cards = game.player1Cards;
  //     let newHand = player1Cards[index];
  //     player1Cards[index] = game.hand;

  //     game.player1Cards = player1Cards;
  //     game.markModified("player1Cards");
  //     game.hand = newHand;
  //     game.markModified("hand");
  //     let player1Flipped = game.player1Flipped;
  //     player1Flipped[index] = "1";
  //     game.player1Flipped = player1Flipped;
  //     game.markModified("player1Flipped");
  //     await game.save();
  //     return { player1Cards, hand: newHand, player1Flipped };
  //   } else {
  //     let player2Cards = game.player2Cards;
  //     let newHand = player2Cards[index];
  //     player2Cards[index] = game.hand;

  //     game.player2Cards = player2Cards;
  //     game.markModified("player2Cards");
  //     game.hand = newHand;

  //     let player2Flipped = game.player2Flipped;
  //     player2Flipped[index] = "1";
  //     game.player2Flipped = player2Flipped;
  //     game.markModified("player2Flipped");
  //     await game.save();
  //     return { player2Cards, hand: newHand, player2Flipped };
  //   }

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
