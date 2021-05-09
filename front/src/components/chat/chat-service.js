import axios from 'axios';
require('dotenv').config();
class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: `http://localhost:${process.env.REACT_APP_BACK_PORT}/api`,
      withCredentials: true,
    });
    this.service = service;
  }

  createNewMessage = (content, language, loggedInUser) => {
    return this.service
      .post('/messages/new', {
        content,
        language,
        loggedInUser,
      })
      .then((response) => response.data);
  };

  getAllMessages = async (group) => {
    try {
      const messages = await this.service.get('/messages/all');
        
      return messages.data.map(eachMessage => {
        return { message: eachMessage.content}
      })
    }

    catch(err ) {
      console.log(err);
    }
  }
}

export default AuthService;
