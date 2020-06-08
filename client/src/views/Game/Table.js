import React, { Component } from "react";
import {
  draw,
  take,
  deal,
  end,
  roundWon,
  swapCards,
  getState,
  reset,
  scores,
} from "../../GameFunctions";
import "../../App.css";
import Card from "./Card";
import BoardController from "./BoardController";
import EndRound from "./EndRound.js";
import EndGame from "./EndGame.js";
import io from "socket.io-client";
import jwt_decode from "jwt-decode";
const socket = io("http://localhost:3001");

class Table extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      activePlayers: 0,
      player1Name: "",
      player2Name: "",
      playerNumber: 0,
      deck: [],
      hand: "",
      trash: [],
      currentPlayer: 1,
      gameInSession: false,
      playerPlaying: false,
      player1Size: 10,
      player2Size: 10,
      player1Cards: [],
      player2Cards: [],
      player1Flipped: new Array(10).fill(0),
      player2Flipped: new Array(10).fill(0),
      playerWon: 0,
    };
  }

  drawCards = () => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    draw(this.state.id, this.state);
  };

  takeTrash = () => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    take(this.state.id, this.state);
  };

  dealCards = () => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    deal(this.state.id, this.state);
  };

  endTurn = () => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    end(this.state.id, this.state);
  };

  swap = (index) => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    swapCards(this.state.id, index, this.state);
  };

  roundWon = (playerWon) => {
    roundWon(this.state.id, playerWon, this.state);
  };

  resetGame = () => {
    if (this.state.currentPlayer !== this.state.playerNumber) return;
    reset(this.state.id, this.state);
  };

  return = () => {
    scores(this.state.playerNumber, this.state.playerWon);
    this.props.history.push(`/profile`);
  };

  async componentDidMount() {
    const id = localStorage.gametoken;
    const { username } = jwt_decode(localStorage.token);

    socket.emit("joinGame", { id, username });

    socket.on("showConnections", (data) => this.setState(data));
    socket.on("dealResponse", (data) => this.setState(data));
    socket.on("drawResponse", (data) => this.setState(data));
    socket.on("swapResponse", (data) => this.setState(data));
    socket.on("endTurnResponse", (data) => this.setState(data));
    socket.on("takeResponse", (data) => this.setState(data));
    socket.on("roundWonResponse", (data) => this.setState(data));
    socket.on("resetResponse", (data) => this.setState(data));
    socket.on("initResponse", (data) => this.setState(data));

    const { deck } = await getState({ id });
    let playerNumber = this.state.activePlayers === 1 ? 1 : -1;
    await this.setState({
      id: { id },
      playerNumber,
      deck,
    });
  }

  waiting() {
    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h1 className="fas fa-caret-right fa-3x">Trash Online</h1>
            <div className="card card-body text-center">
              <h3 className="fas fa-caret-right fa-2x">
                Waiting for someone to join.
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  table() {
    if (this.state.player1Size === 0 || this.state.player2Size === 0)
      return (
        <EndGame
          player1Name={this.state.player1Name}
          player2Name={this.state.player2Name}
          playerWon={this.state.playerWon}
          return={() => this.return()}
        />
      );
    else if (this.state.playerWon !== 0)
      return (
        <EndRound
          player1Name={this.state.player1Name}
          player2Name={this.state.player2Name}
          playerWon={this.state.playerWon}
          reset={() => this.resetGame()}
        />
      );
    return (
      <div>
        <div className="Table">
          <Card
            value={<img src={require("./assets/top.png")} alt="top" />}
            type="Deck"
          />
          <Card
            value={
              this.state.trash.length > 0 ? (
                <img
                  src={require(`./assets/${[this.state.trash.slice(-1)]}.png`)}
                  alt=""
                />
              ) : (
                <p>Trash</p>
              )
            }
            type="Card"
          />
        </div>

        <div className="Options">
          <button
            onClick={() => this.dealCards()}
            disabled={this.state.gameInSession}
          >
            Deal
          </button>
          <button
            onClick={() => this.drawCards()}
            disabled={!this.state.gameInSession || this.state.playerPlaying}
          >
            Draw
          </button>
          <button
            onClick={() => this.takeTrash()}
            disabled={
              !this.state.gameInSession ||
              this.state.playerPlaying ||
              this.state.trash.length === 0
            }
          >
            Take Trash
          </button>
          <button
            onClick={() => this.endTurn()}
            disabled={!this.state.gameInSession || !this.state.playerPlaying}
          >
            End Turn
          </button>
          <button
            onClick={() => this.resetGame()}
            disabled={!this.state.gameInSession}
          >
            Reset
          </button>
        </div>
        <div>
          {this.state.gameInSession ? (
            <BoardController
              id={this.state.id}
              player={this.state.currentPlayer}
              player1Name={this.state.player1Name}
              player2Name={this.state.player2Name}
              player1Cards={this.state.player1Cards}
              player2Cards={this.state.player2Cards}
              player1Flipped={this.state.player1Flipped}
              player2Flipped={this.state.player2Flipped}
              player1Size={this.state.player1Size}
              player2Size={this.state.player2Size}
              hand={this.state.hand}
              handleSwap={this.swap}
              callWin={this.roundWon}
            />
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.activePlayers !== 2 ? this.waiting() : this.table()}
      </div>
    );
  }
}

export default Table;
