import React, { Component } from "react";
import Card from "./Card.js";
import PlayingCard from "./PlayingCard.js";

class PlayerBoard extends Component {
  handleClick = (player, hand, index) => {
    if (this.getValue(hand) === index + 1 || hand.charAt(0) === "J") {
      this.props.handleClick(index);
    }
  };

  getValue = (card) => {
    let num = "";
    if (card[0] === "A") return 1;
    for (let i = 0; i < card.length; i++) {
      if (card[i] >= "0" && card[i] <= "9") num = num.concat(card[i]);
    }
    return parseInt(num);
  };

  render() {
    const positions = [
      "Ace",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Jack",
      "Queen",
      "King",
    ];
    return (
      <div className="Board">
        <div className="BoardMenu">
          <Card
            value={
              this.props.hand.length > 0 ? (
                <img src={require(`./assets/${this.props.hand}.png`)} alt="" />
              ) : null
            }
            type="Hand"
          />
          <h1> {this.props.playerName} is playing</h1>
        </div>
        <div className="Series">
          {this.props.cards.map((card, index) => {
            return (
              <PlayingCard
                value={
                  this.props.flipped[index] === 1 ? (
                    <img src={require(`./assets/${card}.png`)} alt="" />
                  ) : (
                    <img src={require(`./assets/top.png`)} alt="" />
                  )
                }
                index={index}
                flipped={this.props.flipped[index]}
                player={this.props.currentPlayer}
                hand={this.props.hand}
                key={index}
                positions={positions}
                handleClick={this.handleClick}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default PlayerBoard;
