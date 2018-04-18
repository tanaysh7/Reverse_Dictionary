import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <div>
		<br/>
		<br/>
		<br/>
    <PasswordForgetForm />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
			<div className="container">
	      <form className="well form-horizontal" onSubmit={this.onSubmit}>
					<fieldset/>

					{/* <!-- Form Name --> */}
					<legend><center><h2><b>Fogot Password</b></h2></center></legend><br/>

					<div className="form-group">
						<label className="col-md-4 control-label">Email Address</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<span className="input-group-addon"><i className="glyphicon glyphicon-user"></i></span>
			        		<input
										className="form-control"
			        		  value={this.state.email}
			        		  onChange={event => this.setState(byPropKey('email', event.target.value))}
			        		  type="text"
			        		  placeholder="Email Address"
			        		/>
								</div>
							</div>
					</div>
					<div className="form-group">
						<center>
	        		<button className="btn btn-warning" disabled={isInvalid} type="submit">
	        		  Reset My Password<span className="glyphicon glyphicon-send"></span>
	        		</button>
						</center>
					</div>
	
	        { error && <p>{error.message}</p> }
	      </form>
			</div>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};