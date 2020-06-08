import React, { Component } from "react";
import PlayerBoard from "./PlayerBoard";

class BoardController extends Component {
  flippedAll = () => {
    if (
      this.props.player === 1 &&
      this.props.player1Flipped.every((val, i, arr) => val === 1)
    ) {
      this.props.callWin(1);
    } else if (
      this.props.player === -1 &&
      this.props.player2Flipped.every((val, i, arr) => val === 1)
    ) {
      console.log(this.props.player2Flipped);
      this.props.callWin(2);
    }
  };

  clickHandler = async (index) => {
    await this.props.handleSwap(index);
  };

  componentDidUpdate() {
    this.flippedAll();
  }

  render() {
    return (
      <div>
        {this.props.player === 1 ? (
          <PlayerBoard
            cards={this.props.player1Cards}
            currentPlayer={1}
            playerName={this.props.player1Name}
            hand={this.props.hand}
            flipped={this.props.player1Flipped}
            handleClick={this.clickHandler}
          />
        ) : (
          <PlayerBoard
            cards={this.props.player2Cards}
            currentPlayer={2}
            playerName={this.props.player2Name}
            hand={this.props.hand}
            flipped={this.props.player2Flipped}
            handleClick={this.clickHandler}
          />
        )}
      </div>
    );
  }
}

export default BoardController;
