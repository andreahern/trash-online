import React, { Component } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { stats } from "../UserFunctions";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      wins: 0,
      losses: 0,
    };
  }

  async componentDidMount() {
    try {
      const token = localStorage.token;
      const decoded = jwt_decode(token);
      if (Date.now() >= decoded.exp * 1000) throw new Error("token expired");
      this.setState({ username: decoded.username });
      const { wins, losses } = await stats(decoded.userId);
      this.setState({
        wins,
        losses,
      });
    } catch (err) {
      this.props.history.push(`/users/login`);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const token = localStorage.token;
    const decoded = jwt_decode(token);
    const { wins, losses } = await stats(decoded.userId);

    if (prevState.wins !== wins || prevState.losses !== losses)
      this.setState({
        wins,
        losses,
      });
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="col-md-6 m-auto">
          <h1 className="fas fa-3x">Welcome, {this.state.username}</h1>
          <div className="row mt-5">
            <div className="col-md-6 m-auto">
              <div className="card card-body text-center">
                <h6>
                  Wins: <b>{this.state.wins}</b>
                </h6>
                <h6>
                  Losses: <b>{this.state.losses}</b>
                </h6>
              </div>
            </div>
            <div className="col-md-6 m-auto">
              <div className="card card-body text-center">
                <Link to="/hostgame" className="btn btn-primary btn-block mb-2">
                  Host Game
                </Link>
                <Link to="/joingame" className="btn btn-primary btn-block mb-2">
                  Join Game
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
