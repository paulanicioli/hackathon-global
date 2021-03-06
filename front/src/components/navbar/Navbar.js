import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../auth/auth-service';

class Navbar extends Component {
  state = { loggedInUser: null };

  service = new AuthService();

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps['userInSession'] });
  }

  logoutUser = async () => {
    await this.service.logout().then(() => {
      this.setState({ loggedInUser: null });
    });
  };

  render() {
    if (this.state.loggedInUser) {
      return (
        <nav className="nav-style">
          <ul>
            <li>
              Welcome, {this.state.loggedInUser.username}{' '}
              {this.state.loggedInUser._id}
            </li>
            <li>
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                Chat
              </Link>
            </li>
            <li>
              <Link to="/">
                <button onClick={() => this.logoutUser()}>Logout</button>
              </Link>
            </li>
          </ul>
        </nav>
      );
    } else {
      return (
        <nav className="nav-style">
          <ul>
            <li>
              <Link to="/" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" style={{ textDecoration: 'none' }}>
                Signup
              </Link>
            </li>
          </ul>
        </nav>
      );
    }
  }
}

export default Navbar;
