import React, { Component } from 'react'
import './Chat.css';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3000');

export default class Chat extends Component {

    state = {
        message: ''
      }

    componentDidMount() {
        socket.on('message', data => {
            this.setState ({
                message: data.message
            })
        })
    }

    onChange = event => {
        this.setState({
          message: event.target.value
        })
        socket.emit('new-message', {
          message: event.target.value
        })
      }

    render() {
        return (
            <div className="App" >
                <header className="App-header">
                    <h1>Hello</h1>
                    <input type="text" value={this.state.message} onChange={this.onChange} />
                </header>
            </div>
        )
    }
}
