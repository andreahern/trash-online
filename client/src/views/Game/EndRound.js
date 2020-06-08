import React, { Component } from "react";

class EndRound extends Component {
  render() {
    return (
      <div>
        <h1>
          {this.props.playerWon === 1
            ? this.props.player1Name
            : this.props.player2Name}{" "}
          has Won This Round!
        </h1>
        <p className="lead mt-4">
          <p
            onClick={() => this.props.reset()}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Play Next Round
          </p>
        </p>
      </div>
    );
  }
}

export default EndRound;
