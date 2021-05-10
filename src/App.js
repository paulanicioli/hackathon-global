import React, { Component } from 'react';
import './App.css';

import NavBarCustom from './components/navbar/Navbar';
import Signup from './components/auth/Signup';
import './components/auth/Signup.css';
import './components/navbar/Navbar.css';
import Login from './components/auth/Login';
import AuthService from './components/auth/auth-service';

import Chat from './components/chat/Chat.js';
import { Switch, Route } from 'react-router-dom';

class App extends Component {
  state = { loggedInUser: null };

  service = new AuthService();

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.service
        .loggedin()
        .then((response) => {
          this.setState({
            loggedInUser: response,
          });
        })
        .catch((err) => {
          this.setState({
            loggedInUser: false,
          });
        });
    }
  }

  getTheUser = (userObj) => {
    this.setState({
      loggedInUser: userObj,
    });
  };

  render() {
    this.fetchUser();
    if (this.state.loggedInUser) {
      return (
        <div className="App">
          <NavBarCustom userInSession={this.state.loggedInUser} />
          <Switch>
            <Route
              exact
              path="/chat"
              component={() => <Chat userInSession={this.state.loggedInUser} />}
            />
            <Route
              path="/"
              component={() => <Chat userInSession={this.state.loggedInUser} />}
            />
          </Switch>
        </div>
      );
    } else {
      return (
        <div className="App">
          <NavBarCustom userInSession={this.state.loggedInUser} />
          <Switch>
            <Route
              exact
              path="/signup"
              render={() => <Signup getUser={this.getTheUser} />}
            />
            <Route
              exact
              path="/"
              render={() => <Login getUser={this.getTheUser} />}
            />
          </Switch>
          <Route exact path="/Chat" component={Chat} />
        </div>
      );
    }
  }
}

export default App;
