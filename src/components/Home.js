import React from 'react'

import withAuthorization from './withAuthorization';
import { db } from '../firebase';
import AuthUserContext from './AuthUserContext';

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


const HomePage = () => {
	return (
		<AuthUserContext.Consumer>
			{
				authUser => <InnerHomePageClass authUser={authUser}/>
			}
		</AuthUserContext.Consumer>
	);
};



class InnerHomePageClass extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: {},
			search_history: [],
			authUser: props.authUser
		};
	}

	componentDidMount() {
		db.onceGetUsers(this.state.authUser).then(snapshot => 
		this.setState(() => ({ users: snapshot.val() }))
		);

		this.state.authUser && db.getSearchHistory(this.state.authUser).on('value', (snapshot)=> 
		this.setState(() => ({ search_history: snapshot.val() }))
		);

	}

	render() {
		const { users } = this.state;

		return (
			<div>
				<h1>Home</h1>
				<p>The Home page is accessible by every signed in user</p>

				{ !!users && <UserList users={users}/> }
				<HistoryComponent authUser = {this.state.authUser} search_history={this.state.search_history}/>
			</div>
		)
	}
};

const HistoryComponent = (props) => {
	var list_elements = []
	if (props.search_history) {
		var historyArray = Object.keys(props.search_history).map((key) => 
									[key, JSON.stringify(props.search_history[key])]
								);
		var list_elements = historyArray.map((item) => {return <li key={item[0]}>{item[0]}:{item[1]}</li>})
	}
	window.list_elements = list_elements;
	return (
		<div className="container">
			<h2>History</h2>
					<div className="container">
						{list_elements.length ? 
							<div> 
								<ol>
									{list_elements}
								</ol>
							</div>
							:
							<h3>No search results</h3>}
					</div>
		</div>
	);
}

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