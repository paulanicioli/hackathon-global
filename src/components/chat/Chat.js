// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import axios from 'axios';
import './Chat.css';
import socketIOClient from 'socket.io-client';
import AuthService from './chat-service';

const apiKey = 'AIzaSyCbI4wrAH6It6SAXRH2vkHqxGHXAWcHGYw';
const googleTranslate = require('google-translate')(
  'AIzaSyCbI4wrAH6It6SAXRH2vkHqxGHXAWcHGYw'
);

const socket = socketIOClient(process.env.REACT_APP_BACK_ADDRESS);

function getPromise(key, lang, text) {
  return axios.get(
    `https://translation.googleapis.com/language/translate/v2?key=${key}&target=${lang}&q=${text}`
  );
}
class Chat extends React.Component {
  constructor() {
    super();
    this.service = new AuthService();
    this.state = {
      message: '',
      chat: [],
      languageCodes: [],
      language: 'en',
    };
  }

  loadMessages = async () => {
    try {
      const messages = await this.service.getAllMessages();

      this.setState({
        chat: messages,
      });
    } catch (err) {
      console.log(err);
    }
  };

  componentDidMount() {
    socket.on('new-message', (message) => {
      getPromise(apiKey, this.state.language, message.message).then((promise) =>
        this.setState({
          chat: [
            {
              translated_message:
                promise.data.data.translations[0].translatedText,
              message: message.message,
              username: message.username,
            },
            ...this.state.chat,
          ],
        })
      );
    });

    const getLanguageCodes = (languageCodes) => {
      this.setState({ languageCodes });
    };

    googleTranslate.getSupportedLanguages('en', function (err, languageCodes) {
      getLanguageCodes(languageCodes); // use a callback function to setState
    });
  }

  changeHandler = async (language) => {
    let { chat } = this.state;
    const translatedChat = await chat.map(async (message) => {
      message.translated_message = await getPromise(
        apiKey,
        language,
        message.message
      ).then((promise) => {
        return promise.data.data.translations[0].translatedText;
      });
      return message;
    });

    this.setState({ chat: translatedChat });
  };

  onTextChange = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  onMessageSubmit = () => {
    // const message = this.state;
    socket.emit('message', {
      message: this.state.message,
      username: this.props.userInSession
        ? this.props.userInSession.username
        : 'anonnymous',
    });
    let messageLanguage = '';
    let user = '';
    if (this.props && this.props.userInSession) {
      messageLanguage = this.props.userInSession.language;
      user = this.props.userInSession._id;
    }
    this.service
      .createNewMessage(this.state.message, messageLanguage, user)
      .then((response) => {
        this.setState({
          message: '',
        });
      });
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map((msg, id) => (
      <div key={id}>
        <h2>
          <span>{msg.username}</span>
        </h2>
        <h2>
          <span>{msg.message}</span>
        </h2>
        <h2>
          <span>{msg.translated_message}</span>
        </h2>
      </div>
    ));
  }

  // uploadInDB () {
  //   this.service
  //     .createNewMessage({content: this., language, user})
  //     .then((response) => {
  //       console.log(response);
  //     })
  // }

  // LANGUAGE PICKER OPTIONS

  languageOptions() {
    const { languageCodes, language } = this.state;

    return (
      <div>
        {this.renderChat()}
        <select
          className="select-language"
          value={language}
          onChange={(e) => {
            this.changeHandler(e.target.value);
            this.setState({ language: e.target.value });
          }}
        >
          {languageCodes ? (
            languageCodes.map((lang) => (
              <option key={lang.language} value={lang.language}>
                {lang.name}
              </option>
            ))
          ) : (
            <></>
          )}
        </select>
        <button onClick={this.loadMessages}>See previous messages</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        <span>Message</span>
        <input
          name="message"
          onChange={(event) => this.onTextChange(event)}
          value={this.state.message}
        />
        <button onClick={this.onMessageSubmit}>Send</button>
        {/* <div>{this.renderChat()}</div> */}
        {this.languageOptions()}
      </div>
    );
  }
}

export default Chat;
