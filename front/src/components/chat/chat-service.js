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

  createNewMessage = (content, language, user) => {
    return this.service
      .post('/messages/new', {
        content,
        language,
        user,
      })
      .then((response) => response.data);
  };
}

export default AuthService;
