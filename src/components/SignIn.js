import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { PasswordForgetLink } from './PasswordForget';

const SignInPage = ({ history }) =>
  <div>
		<br/>
		<br/>
		<br/>
    <SignInForm history={history} />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault(); // prevents a reload of the browser which would otherwise be the default behaviour of the browser
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
			<div className="container">
      	<form className="well form-horizontal" onSubmit={this.onSubmit}>

				<fieldset/>
				
				{/* <!-- Form Name --> */}
				<legend><center><h2><b>Sign In</b></h2></center></legend><br/>

      	  <div className="form-group">
						<label className="col-md-4 control-label">Email</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
									<input
										className="form-control"
										value={email}
										onChange={event => this.setState(byPropKey('email', event.target.value))}
										type="text"
										placeholder="Email Address"
									/>
								</div>
							</div>
					</div>
      	  <div className="form-group">
						<label className="col-md-4 control-label">Password</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
									<input
										className="form-control"
										value={password}
										onChange={event => this.setState(byPropKey('password', event.target.value))}
										type="password"
										placeholder="Password"
									/>
							</div>
						</div>
					</div>

      	  <div className="form-group">
							<center>
      	  			<button disabled={isInvalid} type="submit" className="btn btn-warning">
      	  			  Sign In<span className="glyphicon glyphicon-send"></span>
      	  			</button>
							</center>
					</div>

      	  <div className="form-group">
						<center>
				    	<SignUpLink />
						</center>
					</div>

					<div className="form-group">
						<center>
							<PasswordForgetLink />
						</center>
					</div>	

      	  { error && <p>{error.message}</p> }
      	</form>
			</div>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};