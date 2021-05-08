import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';

class Login extends Component {
  state = { username: '', password: '' };

  service = new AuthService();

  handleFormSubmit = (event) => {
    event.preventDefault();
    const nickname = this.state.nickname;
    const password = this.state.password;
    this.service
      .login(nickname, password)
      .then((response) => {
        this.setState({ nickname: '', password: '' });
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
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="nickname"
              value={this.state.nickname}
              onChange={(e) => this.handleChange(e)}
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
            />
          </label>

          <input type="submit" value="Login" />
        </form>
        <p>
          Don't have account?
          <Link to={'/signup'}> Signup</Link>
        </p>
      </div>
    );
  }
}

export default Login;
