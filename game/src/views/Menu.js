import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Profile from "./Profile";
import JoinGame from "./JoinGame";
import HostGame from "./HostGame";
import Table from "./Game/Table";

const MainMenu = () => {
  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 m-auto">
          <h1 className="fas fa-caret-right fa-3x">Trash Online</h1>
          <div className="card card-body text-center">
            <h1>
              <i className="fas fa-door-open fa-2x"></i>
            </h1>

            <p>Create an account or login</p>
            <Link
              to="/users/register"
              className="btn btn-primary btn-block mb-2"
            >
              Register
            </Link>
            <Link to="/users/login" className="btn btn-secondary btn-block">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  return (
    <Router>
      <Route exact path="/" component={MainMenu} />
      <Route exact path="/users/register" component={Register} />
      <Route exact path="/users/login" component={Login} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/joingame" component={JoinGame} />
      <Route exact path="/hostgame" component={HostGame} />
      <Route exact path="/table" component={Table} />
    </Router>
  );
};

export default Menu;
