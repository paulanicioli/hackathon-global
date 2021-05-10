import React, { Component } from 'react';
import AuthService from './auth-service';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


// import 'bootstrap/dist/css/bootstrap.min.css';


class Signup extends Component {
  state = {
    username: '',
    password: '',
    birthDate: '',
    gender: '',
    language: 'en',
    errorMessage: '',
    imageUrl: '',
  };

  service = new AuthService();

  handleFileUpload = async (e) => {
    console.log('The file to be uploaded is: ', e.target.files[0]);

    const uploadData = new FormData();
    await uploadData.append('imageUrl', e.target.files[0]);

    this.service
      .handleUpload(uploadData)
      .then((response) => {
        console.log('Success! Image has been handled!');
        this.setState({ imageUrl: response.secure_url });
      })
      .catch((err) => {
        console.log('Error while uploading the file: ', err);
      });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const email = this.state.email;
    const birthDate = this.state.birthDate;
    const gender = this.state.gender;
    const language = this.state.language;
    const password = this.state.password;
    const imageUrl = this.state.imageUrl;

    this.service
      .signup(username, email, birthDate, gender, language, password, imageUrl)
      .then((response) => {
        console.log('we got the response! => ', response);
        if (response.errorMessage) {
          return this.setState({
            errorMessage: response.errorMessage ? response.errorMessage : null,
          });
        }

        this.setState({
          username: '',
          email: '',
          birthDate: '',
          gender: '',
          language: 'en',
          password: '',
          imageUrl: '',
        });
        this.props.getUser(response);
      })
      .catch((error) => console.log('on react', error));
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <Container id="signup-outter-container">
        <Container id="signup-inner-container">
          <Form id="signup-form" onSubmit={this.handleFormSubmit}>
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

            <Form.Group as={Row} id="email-field">
              <Form.Label column sm={2}>
                Email:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
            </Form.Group>
            
            <Form.Group as={Row} id="birthdate-field">
              <Form.Label column sm={2}>
                Birth date:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={this.state.birthDate}
                  onChange={(e) => this.handleChange(e)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} id="gender-field">
              <Form.Label column sm={2}>
                Gender:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="gender"
                  value={this.state.gender}
                  onChange={(e) => this.handleChange(e)}
                >
                    <option value="">Choose your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} id="language-field">
              <Form.Label column sm={2}>
                Language:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="language"
                  value={this.state.language}
                  onChange={(e) => this.handleChange(e)}
                >
                    <option selected value="en">
                      English
                    </option>
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                </Form.Control>
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


            <Form.Group as={Row} id="file-field">
              <Form.Label column sm={2}>
                  Profile pic:
                </Form.Label>
                <Col sm="auto">
                  <Form.File type="file" onChange={(e) => this.handleFileUpload(e)} />

                </Col>
            </Form.Group>

            <Form.Group id="button-field">
              <Button size="lg" type="submit" className="action-button">
                Signup
              </Button>
            </Form.Group>

          </Form>

          <Container id="to-login">
              <Link to={'/'}> 
                <Button variant="outline-light">                  
                  Already have account? Login
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

export default Signup;
