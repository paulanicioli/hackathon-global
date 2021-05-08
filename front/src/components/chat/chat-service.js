import axios from 'axios';

class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: 'http://localhost:5000/api',
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
