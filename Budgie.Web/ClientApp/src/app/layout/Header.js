import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {

  state = {
    isActive: false,
  }

  toggleNav = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive
    }))
  }

  render() {
    return (
      <nav className="navbar is-fixed-top is-primary" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link
            className="navbar-item brand-text"
            to="/">
            <strong>Budgie</strong>
          </Link>
        </div>
        <div className="navbar-menu">
          {renderAppActions(this.props)}
        </div>
        <div className="navbar-end">
          {renderAuthenticationActions(this.props)}
        </div>
      </nav>
    )
  }
}

function renderAppActions(props) {
  if (props.authentication.isLoggedIn) {
    return (
      <div className="navbar-start">
        <Link
          className="navbar-item"
          to="/categories">
          <span>Categories</span>
        </Link>
      </div>
    );
  }
}

function renderAuthenticationActions(props) {
  if (props.authentication.isLoggedIn) {
    return (
      <div className="navbar-item has-dropdown is-hoverable">
        <span className="navbar-link">
          Hi, {props.authentication.user.firstName}!
        </span>

        <div className="navbar-dropdown is-right">
          <hr className="navbar-divider" />
          <Link
            className="navbar-item"
            to="/login">
            <span>Log out</span>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="navbar-item">
        <div className="buttons">
          <Link
            className="button is-primary"
            to="/register">
            <span>
              <strong>Sign up</strong>
            </span>
          </Link>
          <Link
            className="button is-light"
            to="/login">
            <span>Log in</span>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Header);