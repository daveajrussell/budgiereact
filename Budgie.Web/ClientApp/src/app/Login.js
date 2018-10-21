import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { actionCreators } from './../store/authentication/actions';
import { ButtonSpinner } from './components/ButtonSpinner';

class Login extends Component {
    constructor(props) {
        super(props);

        this.props.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false,
            valid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value,
            submitted: false
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const { username, password } = this.state;

        if (username && password) {
            this.setState({ submitted: true, valid: true });
            this.props.login(username, password);
        } else {
            this.setState({ submitted: true, valid: false });
        }
    }

    isSuccessfulLogin() {
        const { loggingIn, loginSuccess } = this.props.authentication;
        const { submitted, valid } = this.state;

        if (submitted && valid && !loggingIn) return true;

        return !loginSuccess;
    }

    render() {
        const { loggingIn, message, loginSuccess } = this.props.authentication;
        const { username, password, submitted, valid } = this.state;
        return (
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-3 is-offset-4">
                            <div className="content">
                                <h2>Login</h2>
                                <p>
                                    Some sort of interesting text.
                                </p>
                                <form name="form" onSubmit={this.handleSubmit} noValidate="true">

                                    <div className="field">
                                        <div className="control">
                                            <input className={submitted && !username ? 'input is-danger' : 'input'}
                                                type="email"
                                                placeholder="Email"
                                                name="username"
                                                value={username}
                                                onChange={this.handleChange} />
                                        </div>
                                        {
                                            submitted && !username &&
                                            <p className="help is-danger">
                                                This field is required
                                            </p>
                                        }
                                    </div>

                                    <div className="field">
                                        <div className="control">
                                            <input className={submitted && !password ? 'input is-danger' : 'input'}
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                value={password}
                                                onChange={this.handleChange} />
                                        </div>
                                        {
                                            submitted && !password &&
                                            <p className="help is-danger">
                                                This field is required
                                            </p>
                                        }
                                        {
                                            submitted && valid && !loggingIn && !loginSuccess &&
                                            <p className="help is-danger">
                                                {message ? message : 'Please check your username & password'}
                                            </p>
                                        }
                                    </div>

                                    <div className="field is-grouped">
                                        <p className="control">
                                            <ButtonSpinner text="Login" loading={loggingIn} buttonClass={(submitted && !valid) || submitted && valid && !loggingIn && !loginSuccess ? 'is-danger' : 'is-primary'} />
                                        </p>
                                        <p>
                                            <Link to="/register" className="button">Register</Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(connect(
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Login));