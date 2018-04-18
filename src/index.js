// 'react' module dependency of the project
import React from 'react';
// 'react-dom' module dependency of the project
import ReactDOM from 'react-dom';
// all the css for the html pages goes here
import './index.css';
// App.js file in the components folder , basically the pandora's box which exposes all the code
import App from './components/App';
// TODO: - understand what registerServiceWorker does
// this is a file already given by the create React app guys
// it helps in production deployment and caching parts of the website
import registerServiceWorker from './registerServiceWorker';
// bootstrap files stored here
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './include/bootstrap'

// <App /> class component is a part of the App module we imported in line 8
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker(); 
