import React from 'react'

import withAuthorization from './withAuthorization';
import { db } from '../firebase';

// before db firebase
// const HomePage = () => {
//     return (
//         <div>
//             <h1>Home Page</h1>
// 						<p> The Home Page is accessible by every signed in user.</p>
//         </div>
//     )
// }

// stateful Component for HomePage
class HomePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: {}
		};
	}

	componentDidMount() {
		db.onceGetUsers().then(snapshot => 
		this.setState(() => ({ users: snapshot.val() }))
		);
	}

	render() {
		const { users } = this.state;

		return (
			<div>
				<h1>Home</h1>
				<p>The Home page is accessible by every signed in user</p>
 
				{ !!users && <UserList users={users}/> }
			</div>
		)
	}
};

const UserList = ({ users }) => {
	return (
		<div>
			<h2>List of Usernames of Users</h2>
			<p>(Saved on Sign Up in Firebase Database)</p>

			{
				Object.keys(users).map(key => 
					<div key={key}>{users[key].username}</div>
				)
			}
		</div>
	);
};
	

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);