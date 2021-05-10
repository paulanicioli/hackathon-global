import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import './Login.css'

class Login extends Component {
  state = { username: '', password: '' };

  service = new AuthService();

  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;
    this.service
      .login(username, password)
      .then((response) => {
        console.log(response)
        if (response.errorMessage) {
            return this.setState({
              errorMessage: response.errorMessage ? response.errorMessage : null,
            })
        }

        this.setState({
          username: response.username,
          password: response.password,
        });
        this.props.getUser(response);
      })
      .catch((error) => console.log(error));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Container id="login-outter-container">
        <Container id="login-inner-container">
          <Form onSubmit={this.handleFormSubmit}>
            <Form.Group as={Row} id="username-field">
                <Form.Label column sm={2}>
                  Username
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={(e) => this.handleChange(e)}
                    />
                </Col>            
              </Form.Group>
           
              <Form.Group as={Row} id="password-field">
                <Form.Label column sm={2}>
                  Password:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={(e) => this.handleChange(e)}
                  />
                </Col>
            </Form.Group>

            <Form.Group id="button-field">
              <Button size="lg" type="submit" className="action-button">
                Login
              </Button>
            </Form.Group>
          </Form>

          <Container id="to-login">
              <Link to={'/signup'}> 
                <Button variant="outline-light">                  
                Don't have account? Signup
                </Button>
              </Link>
          </Container>

          { this.state.errorMessage ? 
            <Container id="auth-error">
              <h3>{this.state.errorMessage}</h3>
            </Container>
          : null }
         
        </Container>
      </Container>
    );
  }
}

export default Login;
