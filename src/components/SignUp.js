import React, { Component } from 'react';
import { 
	Link,
	withRouter
} from 'react-router-dom';

import { auth, db } from '../firebase';
import * as routes from '../constants/routes';

// any component which goes into the withRouter() higher order component gets access to all the properties of the router
// thus when passing the SignUpPage component to the HOC it has its own function signature access to the props of the React Router ie. router props are now included 
// in this.props for the class component SignUpPage
// The relevant property for us from the router props is the history object 
// history is used here primarily to route the newly signed up user to his/her home page once they successfully sign up
// it is used in the onSubmit method where history.push(routes.HOME is called)
const SignUpPage = ({ history }) =>
	<div>
		<br/>
		<br/>
		<br/>
		<SignUpForm history={history}/>
	</div>

const INITIAL_STATE = {
	username: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

const byPropKey = (propertyName, value) => () => ({
	[propertyName]: value,
});

class SignUpForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = (event) => {
		const {
			username,
			email,
			passwordOne,
		  } = this.state;
	  
		const {
			history,
		} = this.props;

		auth.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				db.doCreateUser(authUser.uid, username, email)
					.then(() => {
						this.setState(() => ({ ...INITIAL_STATE }));
						history.push(routes.HOME);
					})
					.catch(error => {
						this.setState(byPropKey('error', error));
					});
				
				// before db was declared
				// this.setState(() => ({ ...INITIAL_STATE }));
				// history.push(routes.HOME);
			})
			.catch(error => {
				this.setState(byPropKey('error', error));
			});
	
		event.preventDefault();
	}

	render() {
		const {
			username,
			email,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;

		const isInvalid =
      		passwordOne !== passwordTwo ||
      		passwordOne === '' ||
      		email === '' ||
      		username === '';

		return (
			<div className="container">
				<form className="well form-horizontal" onSubmit={this.onSubmit}>

				<fieldset/>
				
				{/* <!-- Form Name --> */}
				<legend><center><h2><b>Sign Up</b></h2></center></legend><br/>


					<div className="form-group">
						<label className="col-md-4 control-label">Full Name</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
								<input
									className="form-control"
									aria-describedby="basic-addon1"
									value={username}
									onChange={event => this.setState(byPropKey('username', event.target.value))}
									type="text"
									placeholder="Full Name"
								/>
							</div>
						</div>
					</div>
					<br/>
					<div className="form-group">
						<label className="col-md-4 control-label">Email Address</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>

								<input
									className="form-control"
									aria-describedby="basic-addon1"
									value={email}
									onChange={event => this.setState(byPropKey('email', event.target.value))}
									type="text"
									placeholder="Email Address"
								/>
							</div>
						</div>
					</div>
					<br/>
					<div className="form-group">
						<label className="col-md-4 control-label">Password</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>


								<input
									className="form-control"
									aria-describedby="basic-addon1"
									value={passwordOne}
									onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
									type="password"
									placeholder="Password"
								/>
							</div>
						</div>
					</div>
					<br/>
					<div className="form-group">
						<label className="col-md-4 control-label">Confirm Password</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>


								<input
									className="form-control"
									aria-describedby="basic-addon1"
									value={passwordTwo}
									onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
									type="password"
									placeholder="Confirm Password"
								/>
							</div>
						</div>
					</div>
					<br/>
						<div className="form-group">
							<center>
								<button disabled={isInvalid} type="submit" className="btn btn-warning">
									Sign Up<span className="glyphicon glyphicon-send"></span>
								</button>
							</center>
						</div>
					{ error && <p>{error.message}</p> }
				</form>
			</div>
		);
	}
}

const SignUpLink = () =>
	<p>
		Don't have an account?
		{' '}
		<Link to={routes.SIGN_UP}>Sign Up</Link>
	</p>

export default withRouter(SignUpPage);

export {
	SignUpForm,
	SignUpLink,
};