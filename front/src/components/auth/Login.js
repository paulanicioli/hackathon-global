import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';
import './Login.css';

class Login extends Component {
  state = { username: '', password: '' };

  service = new AuthService();

  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    this.service
      .login(username, password)
      .then((response) => {
        this.setState({
          username: response.username,
          password: response.password,
        });
        this.props.getUser(response);
      })
      .catch((error) => console.log(error));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className="loginWindow">
        <form onSubmit={this.handleFormSubmit}>
          <label>
          <h3>Username</h3>
            <input className="userPassFields"
              type="text"
              name="username"
              value={this.state.username}
              onChange={(e) => this.handleChange(e)}
            />
          </label>
          <label>
            <h3>Password</h3>
            <input 
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
              className="userPassFields"
            />
          </label>

          <button type="submit" className="sendBtn">Login</button>
          <p>
          Don't have account?
          <Link to={'/signup'}> Signup</Link>
        </p>
        </form>
        
      </div>
    );
  }
}

export default Login;
