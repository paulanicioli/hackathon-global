import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';

class Login extends Component {
  state = { nickname: '', password: '' };

  service = new AuthService();

  handleFormSubmit = (event) => {
    event.preventDefault();
    const nickname = this.state.nickname;
    const password = this.state.password;
    console.log('Event being handled!');
    this.service
      .login(nickname, password)
      .then((response) => {
        console.log(response);
        this.setState({
          nickname: response.nickname,
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
      <div>
        <form onSubmit={this.handleFormSubmit}>
          <label>
            Nickname:
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
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.handleChange(e)}
            />
          </label>

          <button type="submit">Login</button>
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
