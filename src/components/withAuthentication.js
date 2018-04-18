import React from 'react';

// import PropTypes from 'prop-types';

import AuthUserContext from './AuthUserContext';
import { firebase } from '../firebase';

// The component being passed here is App from App.js
const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
        super(props);
  
        this.state = {
          authUser: null,
        };
      }
  
		// proptype method that returns the context object to pass down the component's hierarchy
		// everytime the state changes or the object receives new props this method will be called
    // getChildContext() {
    //     return {
    //         authUser: this.state.authUser,
    //     };
    // }

    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
            ? this.setState(() => ({ authUser }))
            : this.setState(() => ({ authUser: null }));
        });
    }
    render() {
			const { authUser } = this.state;

      return (
				<AuthUserContext.Provider value={authUser}>
	        <Component />
				</AuthUserContext.Provider>
      );
    }
  }

	// Properties specified in the childContextTypes are propagated along the hierarchy even if none of the 
	// intermediate components in the hierarchy implement either the getChildContext method or have the childContextTypes property
	// static property that allows you to declare structure of the context object being passed to your components descendants
	// similar fashion to propTypes but not optional 
  // WithAuthentication.childContextTypes = {
  //   authUser: PropTypes.object,
  // };

  return WithAuthentication;
}

export default withAuthentication;