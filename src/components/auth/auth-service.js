import axios from 'axios';
require('dotenv').config();

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: process.env.REACT_APP_BACK_ADDRESS + '/api',
      withCredentials: true,
    });
    this.service = service;
  }

  signup = (username, email, birthDate, gender, language, password) => {
    return this.service
      .post('/signup', {
        username,
        email,
        birthDate,
        gender,
        language,
        password,
      })
      .then((response) => response.data)
      .catch(err => err.response.data)
  };

  loggedin = async () => {
    const response = await this.service
      .get('/loggedin')
      .then((response) => response.data);
    // return response;
  };

  login = async (username, password) => {
    const loggedUser = await this.service
      .post('/login', { username: username, password: password })
      .then((response) => response.data);
    return loggedUser;
  };

  logout = async () => {
    const loggedOutUser = await this.service
      .post('/logout', {})
      .then((response) => response.data);
    return loggedOutUser;
  };
}

export default AuthService;
