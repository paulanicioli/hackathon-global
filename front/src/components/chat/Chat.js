import React, { Component } from 'react'
import './Chat.css';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:5000');


class Chat extends React.Component {
  constructor() {
    super();
    this.state = { message: "", chat: [] };
  }

  componentDidMount() {
    socket.on("chat message", (message) => {
      this.setState({
        chat: [...this.state.chat, message]
      });
    });
  }

  onTextChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  onMessageSubmit = () => {
    const message = this.state;
    socket.emit("message", {
      message: this.state.message
    })
    console.log(message)
    this.setState({
      message: ""
    });
  }

  renderChat() {
    const { chat } = this.state;
    return chat.map((message, id) => (
      <div key={id}>
        <h2>
          <span>{message}</span>
        </h2>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <span>Message</span>
        <input
          name="message"
          onChange={event => this.onTextChange(event)}
          value={this.state.message}
        />
        <button onClick={this.onMessageSubmit}>Send</button>
        <div>
          {this.renderChat()}</div>
      </div>
    );
  }
}

export default Chat;

