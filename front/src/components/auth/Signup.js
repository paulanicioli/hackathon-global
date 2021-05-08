import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';

class Signup extends Component {
  state = {
    nickname: '',
    password: '',
    birthDate: new Date(),
    gender: '',
    language: 'en',
  };

  service = new AuthService();

  handleFormSubmit = (event) => {
    event.preventDefault();
    const nickname = this.state.nickname;
    const email = this.state.email;
    const birthDate = this.state.birthDate;
    const gender = this.state.gender;
    const language = this.state.language;
    const password = this.state.password;

    this.service
      .signup(nickname, email, birthDate, gender, language, password)
      .then((response) => {
        this.setState({
          nickname: '',
          email: '',
          birthDate: new Date(),
          gender: '',
          language: 'en',
          password: '',
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
            Email:
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={(e) => this.handleChange(e)}
            />
          </label>
          <label>
            Birth date:
            <input
              type="date"
              name="birthDate"
              value={this.state.birthDate}
              onChange={(e) => this.handleChange(e)}
            />
          </label>
          <label>
            Gender:
            <input
              type="text"
              name="gender"
              value={this.state.gender}
              onChange={(e) => this.handleChange(e)}
            />
          </label>
          <label>
            Language:
            <input
              type="text"
              name="language"
              value={this.state.language}
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

          <input type="submit" value="Signup" />
        </form>

        <p>
          Already have account?
          <Link to={'/'}> Login</Link>
        </p>
      </div>
    );
  }
}

export default Signup;
