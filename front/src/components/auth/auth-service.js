import axios from 'axios';

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: 'http://localhost:5000/api',
      withCredentials: true,
    });
    this.service = service;
  }

  signup = (nickname, email, birthDate, gender, language, password) => {
    return this.service
      .post('/signup', {
        nickname,
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

  login = (nickname, password) => {
    return this.service
      .post('/login', { nickname, password })
      .then((response) => response.data);
  };

  logout = () => {
    return this.service.post('/logout', {}).then((response) => response.data);
  };
}

export default AuthService;
