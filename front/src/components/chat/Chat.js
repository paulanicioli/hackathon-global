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
      language: 'en' };
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
			getPromise(apiKey, this.state.language, message.message).then((promise) =>
				this.setState({
					chat: [
						{ message: promise.data.data.translations[0].translatedText },
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

		let data = responses.map((promise) => {
			let obj = { message: promise.data.data.translations[0].translatedText };
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
    return chat.map((msg, id) => (
      <div className="msg" key={id}>
        <p>
          <span>{msg.message}</span>
        </p>
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
				<div className="language">
				<select
					className="langSelect"
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
        <button onClick={this.loadMessages} className="sendBtn">See previous messages</button>
		</div>
						<div>{this.renderChat()}</div>
			</div>
		);
	}

	render() {
		return (
			<div className="bar">
				<div className="newMsg">
				<input
					className="messageBar"
					name="message"
					onChange={(event) => this.onTextChange(event)}
					value={this.state.message}
				/>
				<button onClick={this.onMessageSubmit} className="sendBtn">Send</button>
				{/* <div>{this.renderChat()}</div> */}
				</div>
				<div>{this.languageOptions()}</div>
				
				
				
			</div>
		);
	}
}

export default Chat;
