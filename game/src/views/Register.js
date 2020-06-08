import React, { Component } from "react";
import { Link } from "react-router-dom";
import { register } from "../UserFunctions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      errors: [],
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      password: this.state.password,
    };

    register(newUser).then((res) => {
      if (!res.error) {
        this.props.history.push(`/profile`);
      } else {
        this.setState({ errors: res.error });
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div className="mt-5">
          <div className="col-md-6 m-auto">
            <div className="card card-body">
              <h1 className="text-center mb-3">
                <i className="fas fa-user-plus"></i> Register
              </h1>

              {this.state.errors ? (
                <p style={{ color: "red" }}>{this.state.errors}</p>
              ) : null}

              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Username</label>
                  <input
                    type="username"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter Username"
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Create Password"
                    onChange={this.onChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
              <p className="lead mt-4">
                Have An Account? <Link to="/users/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
