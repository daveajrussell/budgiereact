import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { actionCreators } from './../store/authentication/actions';
import { ButtonSpinner } from './components/ButtonSpinner';

class Register extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: {
				firstName: '',
				lastName: '',
				username: '',
				password: ''
			},
			validPassword: true,
			validEmail: true,
			submitted: false,
			registering: false,
			message: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.validatePassword = this.validatePassword.bind(this);
		this.validateEmail = this.validateEmail.bind(this);
	}

	handleChange(event) {
		const { name, value } = event.target;
		const { user } = this.state;
		this.setState({
			user: {
				...user,
				[name]: value
			},
			submitted: false
		});
	}

	validateEmail(event) {
		const email = event.target.value,
			regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (email) {
			let test = regex.test(email);
			this.setState({ validEmail: test });
		}
	}

	validatePassword(event) {
		const password = event.target.value,
			regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

		if (password) {
			let test = regex.test(password);
			this.setState({ validPassword: test });
		}
	}

	handleSubmit(event) {
		event.preventDefault();

		this.setState({ submitted: true });
		const { user } = this.state;
		if (user.firstName && user.lastName && user.username && user.password) {
			this.props.register(user);
		}
	}

	isSuccessfulRegistration() {
		const { registering, registrationSuccess } = this.props.authentication;
		const { submitted } = this.state;
		return submitted && !registering && !registrationSuccess;
	}

	render() {
		const { registering, message } = this.props.authentication;
		const { user, submitted, validPassword, validEmail } = this.state;
		return (

			<section className="section">
				<div className="container">
					<div className="columns">
						<div className="column is-3 is-offset-4">
							<div className="content">
								<h2>Register</h2>
								<p>
									Some sort of interesting text.
                                </p>
								<form name="form" onSubmit={this.handleSubmit} noValidate={true}>

									<div className="field">
										<div className="control">
											<input className={submitted && !user.firstName ? 'input is-danger' : 'input'}
												type="text"
												placeholder="First name"
												name="firstName"
												value={user.firstName}
												onChange={this.handleChange} />
										</div>
										{
											submitted && !user.firstName &&
											<p className="help is-danger">
												This field is required
                                            </p>
										}
									</div>

									<div className="field">
										<div className="control">
											<input className={submitted && !user.lastName ? 'input is-danger' : 'input'}
												type="text"
												placeholder="Last name"
												name="lastName"
												value={user.lastName}
												onChange={this.handleChange} />
										</div>
										{
											submitted && !user.lastName &&
											<p className="help is-danger">
												This field is required
                                            </p>
										}
									</div>

									<div className="field">
										<div className="control">
											<input className={(submitted && !user.username) || !validEmail ? 'input is-danger' : 'input'}
												type="email"
												placeholder="Email"
												name="username"
												value={user.username}
												onChange={this.handleChange}
												onBlur={this.validateEmail} />
										</div>
										{
											submitted && !user.username &&
											<p className="help is-danger">
												This field is required
                                            </p>
										}
										{
											!validEmail &&
											<p className="help is-danger">
												Invalid email
                                            </p>
										}
									</div>

									<div className="field">
										<div className="control">
											<input className={(submitted && !user.password) || !validPassword ? 'input is-danger' : 'input'}
												type="password"
												placeholder="Password"
												name="password"
												value={user.password}
												onChange={this.handleChange}
												onBlur={this.validatePassword} />
										</div>
										{
											submitted && !user.password &&
											<p className="help is-danger">
												This field is required
                                            </p>
										}
										{
											!validPassword &&
											<p className="help is-danger">
												Passwords must be at least 8 characters long, with at least one lower-case character, one upper-case character, one digit and one special character
                                            </p>
										}
										{
											this.isSuccessfulRegistration() &&
											<p className="help is-danger">
												{message ? message : 'Something went wrong!'}
											</p>
										}
									</div>

									<div className="field is-grouped">
										<p className="control">
											<ButtonSpinner text="Register" loading={registering} buttonClass={this.isSuccessfulRegistration() ? 'is-danger' : 'is-primary'} />
										</p>
										<p>
											<Link to="/login" className="button">Cancel</Link>
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

export default connect(
	state => state,
	dispatch => bindActionCreators(actionCreators, dispatch)
)(Register);