import React from 'react';

import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { withRouter } from 'react-router-dom';

const SignOutButton = ({ history }) => {
	return <button
    type="button"
    className="btn btn-default navbar-btn"
    onClick={ () => {
			auth.doSignOut()
				.then(() => {
					history.push(routes.LANDING);
				});
		}}
  >
    Sign Out
  </button>
}
  

export default withRouter(SignOutButton);