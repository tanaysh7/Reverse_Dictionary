import React, { Component } from 'react';

import { auth } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
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
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
			<div className="container">
      	<form className="well form-horizontal" onSubmit={this.onSubmit}>

				<fieldset/>
				
				{/* <!-- Form Name --> */}
				<legend><center><h2><b>Account : { this.props.emailId }</b></h2></center></legend><br/>

      	  <div className="form-group">
						<label className="col-md-4 control-label">New Password</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
								<input
									className="form-control"
									value={passwordOne}
									onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
									type="password"
									placeholder="New Password"
								/>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label className="col-md-4 control-label">Confirm New Password</label>
						<div className="col-md-4 inputGroupContainer">
							<div className="input-group">
								<span className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></span>
      	  			<input	
									className="form-control"
      	  			  value={passwordTwo}
      	  			  onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
      	  			  type="password"
      	  			  placeholder="Confirm New Password"
      	  			/>
							</div>
						</div>
					</div>
      	  <div className="form-group">
							<center>
			      	  <button disabled={isInvalid} type="submit" className="btn btn-warning">
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

export default PasswordChangeForm;