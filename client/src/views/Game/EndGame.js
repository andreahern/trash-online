import React, { Component } from "react";

class EndGame extends Component {
  render() {
    return (
      <div>
        <h1>
          {this.props.playerWon === 1
            ? this.props.player1Name
            : this.props.player2Name}{" "}
          has Won The Game!
        </h1>
        <p className="lead mt-4">
          <p
            onClick={() => this.props.return()}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Return to Menu
          </p>
        </p>
      </div>
    );
  }
}

export default EndGame;
