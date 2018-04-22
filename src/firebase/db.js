import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>  {
		return db.ref(`users/${id}`).set({
			username,
			email,
		});
}

export const onceGetUsers = (val) => {
	console.log(val.uid);
	return db.ref('users').once('value');
}

export const getValues = (tableName, word) => {
	return db.ref(tableName).child(word);
}

export const writeUserData = (userId, timestamp, info) => {
	let query = `users/${userId}/history/${timestamp}`
  db.ref(query).set(info);
}

export const getSearchHistory = (user) => {
	let query = `users/${user.uid}/history`;
	return db.ref(query);	
}

export const getReverseValues = (me, tableName, word, pos, callback) => {
	var dbRef;
	if (pos == 'an') {
		dbRef = db.ref(`${tableName}/${word}`)
		dbRef.on('value', (snapshot) => {
			callback(me, snapshot.val());
		});
	} else {
		dbRef = db.ref(`${tableName}/${word}/${pos}`)
		dbRef.on('value', (snapshot) => {
			var returnObj = {};
			returnObj[pos] = snapshot.val(); 
			callback(me, returnObj);
		});
	}
	return 0;
}