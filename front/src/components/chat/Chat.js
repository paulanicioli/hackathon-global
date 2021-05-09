import React, { Component } from 'react';
import './Chat.css';
import socketIOClient from 'socket.io-client';
import AuthService from './chat-service';

const socket = socketIOClient('http://localhost:5000');

class Chat extends React.Component {
  constructor() {
    super();
    this.service = new AuthService();
    this.state = {
      message: '',
      chat: []
    };
  }

  loadMessages = async () => {
    try {
      const messages = await this.service.getAllMessages();

      this.setState({
        chat: messages,
      });
    }
  
    catch(err) {
      console.log(err)
    }
      
    }

  componentDidMount() {
    socket.on('new-message', (message) => {
      this.setState({
        chat: [message, ...this.state.chat],
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
    this.service
      .createNewMessage(
        this.state.message,
        this.props.userInSession.language,
        this.props.userInSession._id
      )
      .then((response) => {
        this.setState({
          message: '',
        });
      });
  };

  renderChat() {
    const { chat } = this.state;
    console.log(chat)
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
  //     .createNewMessage({content: this., language, user})
  //     .then((response) => {
  //       console.log(response);
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
        <button onClick={this.loadMessages}>See previous messages</button>
        <button onClick={this.onMessageSubmit}>Send</button>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default Chat;
