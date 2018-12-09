import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../store/history';

class Header extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    }
  }

  componentDidMount() {
    history.listen(location => {
      this.setState({
        isExpanded: false
      });
    });
  }

  toggleBurger = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }))
  }

  render() {
    const { isExpanded } = this.state;
    const className = isExpanded ? 'is-active' : '';
    const burgerClass = `navbar-burger burger ${className}`;
    const navbarClass = `navbar-menu ${className}`;
    return (
      <nav className="navbar is-fixed-top is-primary" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <Link
            className="navbar-item brand-text"
            to="/">
            <strong>budgie</strong>
          </Link>
          <a href="#" onClick={(e) => this.toggleBurger(e)} className={burgerClass} aria-label="menu" aria-expanded={isExpanded} data-target="navbar">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbar" className={navbarClass}>
          {renderAppActions(this.props)}
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
        <Link
          className="navbar-item"
          to="/budget">
          <span>Budget</span>
        </Link>
      </div>
    );
  }
}

function renderAuthenticationActions(props) {
  if (props.authentication.isLoggedIn) {
    return (
      <div className="navbar-end">
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
      </div>
    );
  } else {
    return (
      <div className="navbar-end">
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Header);