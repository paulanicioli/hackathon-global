import React, { Component } from 'react';

class Profile extends Component {
  render() {
    if (this.props.userInSession) {
      return (
        <div>
          <div>
            <h2>
              username: <span>{this.props.userInSession.username}</span>
            </h2>
          </div>
          <div>
            <h2>
              email: <span>{this.props.userInSession.email}</span>
            </h2>
          </div>
          <div>
            <h2>
              gender: <span>{this.props.userInSession.gender}</span>
            </h2>
          </div>
          <div>
            <img
              className="my-profile-image"
              src={this.props.userInSession.pictureUrl}
              alt={this.props.userInSession.username}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2>You do not have access to this page!</h2>
        </div>
      );
    }
  }
}

export default Profile;
