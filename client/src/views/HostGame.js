import React, { Component } from "react";
import { host } from "../GameFunctions";
import jwt_decode from "jwt-decode";

class HostGame extends Component {
  constructor() {
    super();
    this.state = {
      gameName: "",
      password: "",
      errors: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    try {
      const token = localStorage.token;
      const decoded = jwt_decode(token);
      if (Date.now() >= decoded.exp * 1000) throw new Error("token expired");
    } catch (err) {
      this.props.history.push(`/users/login`);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newGame = {
      host: this.state.username,
      gameName: this.state.gameName,
      password: this.state.password,
    };
    host(newGame).then((res) => {
      if (!res.error) {
        this.props.history.push(`/table`);
      } else {
        this.setState({ errors: res.error });
      }
    });
  }
  render() {
    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h1 className="fas fa-3x">Host Game</h1>

            <div className="card card-body">
              {this.state.errors ? (
                <p style={{ color: "red" }}>{this.state.errors}</p>
              ) : null}

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Game Name</label>
                  <input
                    type="name"
                    id="gameName"
                    name="gameName"
                    className="form-control"
                    placeholder="Enter Game Name"
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Game Password (Optional)</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter Game Password"
                    onChange={this.onChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Create Game
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HostGame;
