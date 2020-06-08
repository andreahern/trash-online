import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { find, join } from "../GameFunctions";

class JoinGame extends Component {
  constructor() {
    super();
    this.state = {
      openGames: [],
    };

    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    try {
      const token = localStorage.token;
      const decoded = jwt_decode(token);
      if (Date.now() >= decoded.exp * 1000) throw new Error("token expired");
      const openGames = await find();
      this.setState({
        openGames: openGames.data,
      });
    } catch (err) {
      console.log(err.message);
      this.props.history.push(`/users/login`);
    }
  }

  handleClick(id) {
    const newUser = {
      id: id,
      password: this.state.password,
    };

    join(newUser).then((res) => {
      if (!res.error) {
        this.props.history.push(`/table`);
      }
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h1 className="fas fa-3x">Join Game</h1>
            <div className="card card-body">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  onChange={this.onChange}
                />
              </div>
              {this.state.openGames.map((game, key) => {
                return (
                  <div key={key + 100}>
                    <h3 className="fas fa-2x mt-2">{game.name}</h3>
                    <button
                      onClick={() => {
                        this.handleClick(game._id);
                      }}
                      className="btn btn-primary ml-3"
                    >
                      Join
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinGame;
