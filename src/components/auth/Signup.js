import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';

class Signup extends Component {
  state = {
    username: '',
    password: '',
    birthDate: '',
    gender: '',
    language: 'en',
    imageUrl: '',
  };

  service = new AuthService();

  handleFileUpload = async (e) => {
    console.log('The file to be uploaded is: ', e.target.files[0]);

    const uploadData = new FormData();
    await uploadData.append('imageUrl', e.target.files[0]);

    this.service
      .handleUpload(uploadData)
      .then((response) => {
        console.log('Success! Image has been handled!');
        this.setState({ imageUrl: response.secure_url });
      })
      .catch((err) => {
        console.log('Error while uploading the file: ', err);
      });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const email = this.state.email;
    const birthDate = this.state.birthDate;
    const gender = this.state.gender;
    const language = this.state.language;
    const password = this.state.password;
    const imageUrl = this.state.imageUrl;

    this.service
      .signup(username, email, birthDate, gender, language, password, imageUrl)
      .then((response) => {
        this.setState({
          username: '',
          email: '',
          birthDate: '',
          gender: '',
          language: 'en',
          password: '',
          imageUrl: '',
        });
        this.props.getUser(response);
      })
      .catch((error) => console.log('on react', error));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <div>
        <form className="signup-form" onSubmit={this.handleFormSubmit}>
          <label>
            username:
            <input
              type="text"
              name="username"
              value={this.state.username}
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
            <select
              type="text"
              name="gender"
              value={this.state.gender}
              onChange={(e) => this.handleChange(e)}
            >
              <option value="">Choose your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </label>
          <label>
            Language:
            <select
              type="text"
              name="language"
              value={this.state.language}
              onChange={(e) => this.handleChange(e)}
            >
              <option selected value="en">
                English
              </option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
            </select>
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
          <input type="file" onChange={(e) => this.handleFileUpload(e)} />

          <button type="submit" className="action-button">
            Signup
          </button>
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
