import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import logo from '../images/reverseDictionary.png';
import AuthUserContext from './AuthUserContext';

const Navigation = (props, { authUser }) => {
    if (authUser) {
        console.log(authUser.email)
    }
    return(
				<AuthUserContext.Consumer>
					{
						authUser => authUser
							? <NavigationAuth user={authUser.email}/>
							: <NavigationNonAuth/>
					}
				</AuthUserContext.Consumer>
        // <div>
        //     { authUser
        //         ? <NavigationAuth user={authUser.email}/>
        //         : <NavigationNonAuth />
        //     }
        // </div>
    )
}
  

Navigation.contextTypes = {
    authUser: PropTypes.object,
};

const NavigationAuth = (props) =>
    <div>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <img height="50" width="60" className="navbar-brand" alt="Brand" src={logo}/>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <li><Link to={routes.LANDING}>Landing</Link></li>
                        <li><Link to={routes.HOME}>Home</Link></li>
                        <li><Link to={routes.ACCOUNT}>{props.user}</Link></li>
                        <li><SignOutButton /></li>
                    </ul>
                </div>
            </div>
        </nav>
        <br/><br/>
    </div>

const NavigationNonAuth = () =>
    <div>
        <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container-fluid">
                <div className="navbar-header">
                    <img height="50" width="60" className="navbar-brand" alt="Brand" src={logo}/>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> 
                    <ul className="nav navbar-nav">
                        <li><Link to={routes.LANDING}>Landing</Link></li>
                        <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
        <br/><br/>
    </div>
export default Navigation;
