// mandatory imports
import React, { Component } from 'react';
// All css pertaining to the class divs
import './App.css';
// BrowserRouter and Route are libraries used for routing in your client side application
import { 
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

// Navigation.js has the logic for whether the user is authenticated or not
// If the user is signed in (authenticated) his/her email id shows up on the top right and a new account page is also added to the navigation and view 
// Signed in user has a landing page, account's page (denoted by their email id), a sign out option and a home page
// If the user is not authenticated then there is a sign in and landing page view
import Navigation from './Navigation';

// Landing.js for now just has LandingPage component with a Landing page header
// This is where we want some dashboard insights to come
import LandingPage from './Landing';
// SignUp.js contains the form to signup to the website
// 
import SignUpPage from './SignUp';
import SignInPage from './SignIn';
import PasswordForgetPage from './PasswordForget';
import HomePage from './Home';
import AccountPage from './Account';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import withAuthentication from './withAuthentication';

const App = () =>
  <Router>
    <div>
      <Navigation />

			{/* 
			- use exact path only for matching the exact url's 
			- for instance here routes.LANDING = '/'
			- so using exact path matches only this URL
			- it won't match /1 or /2 or any other nonsense like that	
			 */}
      <Route exact path={routes.LANDING} component={() => <LandingPage />} />
      <Route exact path={routes.SIGN_UP} component={() => <SignUpPage />} />
      <Route exact path={routes.SIGN_IN} component={() => <SignInPage />} />
      <Route exact path={routes.PASSWORD_FORGET} component={() => <PasswordForgetPage />} />
      <Route exact path={routes.HOME} component={() => <HomePage />} />
      <Route exact path={routes.ACCOUNT} component={() => <AccountPage />} />
    </div>
  </Router>

export default withAuthentication(App);
