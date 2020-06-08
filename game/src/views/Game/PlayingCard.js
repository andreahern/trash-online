import React, { Component } from "react";

class PlayingCard extends Component {
  render() {
    return (
      <div
        className="Card"
        onClick={() =>
          this.props.handleClick(
            this.props.player,
            this.props.hand,
            this.props.index
          )
        }
      >
        {this.props.value}
      </div>
    );
  }
}

export default PlayingCard;
