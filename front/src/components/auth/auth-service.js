import axios from 'axios';
require('dotenv');
class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: `http://localhost:${process.env.BACK_PORT}/api`,
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
      .then((response) => response.data);
  };

  loggedin = () => {
    return this.service.get('/loggedin').then((response) => response.data);
  };

  login = async (username, password) => {
    const loggedUser = await this.service
      .post('/login', { username: username, password: password })
      .then((response) => response.data);
    return loggedUser;
  };

  logout = () => {
    return this.service.post('/logout', {}).then((response) => response.data);
  };
}

export default AuthService;
