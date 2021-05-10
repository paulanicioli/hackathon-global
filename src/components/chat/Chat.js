import React, { Component } from 'react';
import axios from 'axios';
import './Chat.css';
import socketIOClient from 'socket.io-client';
import AuthService from './chat-service';

const apiKey = process.env.REACT_APP_API_KEY;
const googleTranslate = require('google-translate')(apiKey);

const socket = socketIOClient(process.env.REACT_APP_BACK_ADDRESS);

function getPromise(key, lang, text) {
  return axios.get(
    `https://translation.googleapis.com/language/translate/v2?key=${key}&target=${lang}&q=${text}`
  );
}
class Chat extends Component {
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
      console.log(message, typeof message.timestamp);
      getPromise(apiKey, this.state.language, message.message).then((promise) =>
        this.setState({
          chat: [
            {
              translated_message:
                promise.data.data.translations[0].translatedText,
              message: message.message,
              username: message.username,
              timestamp: message.timestamp,
              pictureUrl: message.pictureUrl,
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
    let msgArr = chat.map((msg) => msg.message);
    let responses = await Promise.all(
      msgArr.map((msg) => getPromise(apiKey, language, msg))
    );

    let data = responses.map((promise, index) => {
      let obj = {
        message: chat[index].message,
        username: chat[index].username,
        timestamp: chat[index].timestamp,
        pictureUrl: chat[index].pictureUrl,
        translated_message: promise.data.data.translations[0].translatedText,
      };
      return obj;
    });

    this.setState({ chat: data });
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
      timestamp: new Date(),
      pictureUrl: this.props.userInSession
        ? this.props.userInSession.pictureUrl
        : 'https://res.cloudinary.com/de4qbzjqh/image/upload/v1620587690/ironhack-hackathon/avatar_placeholer_yebnnp.png',
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
      <div
        className={
          this.props.userInSession &&
          msg.username === this.props.userInSession.username
            ? 'chat-messagesR'
            : 'chat-messagesL'
        }
      >
        {/* {this.renderChat()} */}
        <div
          className={
            this.props.userInSession &&
            msg.username === this.props.userInSession.username
              ? 'msg-boxR'
              : 'msg-boxL'
          }
        >
          <div className="msg-box-msg">
            <span>{msg.message}</span>
            <br />
            {msg.message === msg.translated_message ? null : (
              <span>Translated: {msg.translated_message}</span>
            )}
          </div>
          <div
            className={
              msg.username === this.props.userInSession.username
                ? 'timestampR'
                : 'timestampL'
            }
          >
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="msg-box-user">
          <span className="msg-box-user">{msg.username}</span>
          <img className="msg-user-img" src={msg.pictureUrl} alt="user" />
        </div>
      </div>
    ));
  }
  // LANGUAGE PICKER OPTIONS

  languageOptions() {
    const { languageCodes, language } = this.state;

    return (
      <div>
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
      </div>
    );
  }

  render() {
    return (
      <div className="chat-container">
        <div className="chat">{this.renderChat()}</div>
        <div className="chat-input">
          <div className="chat-language">{this.languageOptions()}</div>
          <input
            name="message"
            type="textarea"
            onChange={(event) => this.onTextChange(event)}
            value={this.state.message}
            autoComplete="off"
          />
          <button onClick={this.onMessageSubmit} className="sendBtn">
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;
