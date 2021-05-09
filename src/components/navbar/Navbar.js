import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../auth/auth-service';

import { Navbar, Nav, NavDropdown, Image } from 'react-bootstrap';

class NavBarCustom extends Component {
  state = { loggedInUser: null };

  service = new AuthService();

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps['userInSession'] });
  }

  logoutUser = async () => {
    await this.service.logout().then(() => {
      this.setState({ loggedInUser: null });
    });
  };

  render() {
    if (this.state.loggedInUser) {
      return (
        <Navbar sticky="top" bg="primary" variant="dark" expand="lg">
          <Navbar.Brand className="website-brand" href="/">
            IronChat
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="d-flex align-items-center me-5">
              <Navbar.Text className="nav-content-spacing">
                Welcome, {this.props.userInSession.username}{' '}
              </Navbar.Text>
              <Link
                to="/chat"
                className="nav-content-spacing"
                style={{ textDecoration: 'none', color: '#f7f7f7' }}
              >
                Chat
              </Link>
              <Image
                className="nav-avatar"
                src={this.props.userInSession.pictureUrl}
                alt={this.props.userInSession.username}
                roundedCircle
              />
              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile/{this.props.userInSession._id}">
                  See my profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/" onClick={() => this.logoutUser()}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    } else {
      return (
        <Navbar sticky="top" bg="primary" variant="dark" expand="lg">
          <Navbar.Brand className="website-brand" href="/">
            IronChat
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="d-flex align-items-center me-5">
              <Nav.Link href="/" className="nav-content-spacing">
                Login
              </Nav.Link>
              <Nav.Link href="/signup" className="nav-content-spacing">
                Signup
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
    }
  }
}

export default NavBarCustom;
