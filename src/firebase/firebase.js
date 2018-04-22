import * as firebase from 'firebase';

const prodConfig = {
    apiKey: "AIzaSyBkABWUnUAxRppS4LUFFB9I4bMo06ZBg0A",
    authDomain: "inf551project.firebaseapp.com",
    databaseURL: "https://inf551project.firebaseio.com",
    projectId: "inf551project",
    storageBucket: "inf551project.appspot.com",
    messagingSenderId: "481533360370"
}

const devConfig = {
    apiKey: "AIzaSyCztY7f6BmMzwojjFf87skxF0KO-MSwTQY",
    authDomain: "inf551project-fd5cb.firebaseapp.com",
    databaseURL: "https://inf551project-fd5cb.firebaseio.com",
    projectId: "inf551project-fd5cb",
    storageBucket: "inf551project-fd5cb.appspot.com",
    messagingSenderId: "409785833121"
};

const config = process.env.NODE_ENV === 'production'
    ? prodConfig
    : devConfig;

if (!firebase.apps.length){
    firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export {
		db,
    auth,
};