import React, { Component } from 'react';
import axios from 'axios';
import './Chat.css';
import socketIOClient from 'socket.io-client';

const apiKey = 'AIzaSyCbI4wrAH6It6SAXRH2vkHqxGHXAWcHGYw';
const googleTranslate = require('google-translate')(
	'AIzaSyCbI4wrAH6It6SAXRH2vkHqxGHXAWcHGYw'
);

const socket = socketIOClient('http://localhost:5000');

function getPromise(key, lang, text) {
	return axios.get(
		`https://translation.googleapis.com/language/translate/v2?key=${key}&target=${lang}&q=${text}`
	);
}
class Chat extends React.Component {
	constructor() {
		super();
		this.state = { message: '', chat: [], languageCodes: [], language: 'en' };
	}

	componentDidMount() {
		socket.on('new-message', (message) => {
			getPromise(apiKey, this.state.language, message.message).then((promise) =>
				this.setState({
					chat: [
						...this.state.chat,
						{ message: promise.data.data.translations[0].translatedText },
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
