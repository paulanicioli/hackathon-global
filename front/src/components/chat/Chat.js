import React, { Component } from 'react';
import './Chat.css';
import socketIOClient from 'socket.io-client';
// import AuthService from './chat-service';

const socket = socketIOClient('http://localhost:5000');

class Chat extends React.Component {
  constructor() {
    super();
    this.state = { message: '', chat: [] };
  }

  // service = new AuthService();

  componentDidMount() {
    socket.on('new-message', (message) => {
      this.setState({
        chat: [...this.state.chat, message],
      });
    });
  }

  onTextChange = (event) => {
    this.setState({
      message: event.target.value,
    });
  };

  onMessageSubmit = () => {
    // const message = this.state;
    socket.emit('message', {
      message: this.state.message,
    });
    this.setState({
      message: '',
    });
  };

  renderChat() {
    const { chat } = this.state;
    return chat.map((msg, id) => (
      <div key={id}>
        <h2>
          <span>{msg.message}</span>
        </h2>
      </div>
    ));
  }

  // uploadInDB () {
  //   this.service
  //     .createNewMessage(content, language, user)
  //     .then((response) => {
  //     })
  // }

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
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default Chat;
