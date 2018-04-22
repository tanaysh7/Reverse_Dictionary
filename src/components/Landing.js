import React, { Component } from 'react';
import { auth, db } from '../firebase';
import * as $ from 'jquery';
import Moment from 'react-moment';
import 'moment-timezone';

// for signed in User's history
// import withAuthorization from './withAuthorization';
import AuthUserContext from './AuthUserContext';

// stateless component for the form and onSubmit methods
const LandingPage = () => {
	return (
		<AuthUserContext.Consumer>
			{
				authUser => <div>
					<br/>
					<br/>
					<br/>
					<ReverseDictionaryForm authUser={authUser}/>
				</div>
			}
		</AuthUserContext.Consumer>
	)
};

const INITIAL_STATE = {
			// me.setState({ search_word:word, result_definitions:temp_val.definitions, result_words:temp_val.words, 
			// result_antonyms:temp_val.antonyms, 
			// result_partofspeech:temp_val.partofspeech, result_synonyms:temp_val.synonyms });
	reverse_pos: '',
	reverse_search_string: '', // important for updating cache
	reverse_empty_input: false,
	reverse_ensw_input: false,
	dictionary_empty_input: false,
	reverse_search_result_status: '',
	reverse_words: '',
	dictionary_search_result_status: '',
	dictionary_search_word: '', // important for updating cache
	result_words : '',
	result_antonyms: '',
	result_definitions: '',	
	result_synonyms: '',
	result_partofspeech: '',
	old_state: {'dictionary':'', 'reverse':''}
};

const Displaybuttons = (props) => {
	let attrib = props.attrib;
	let words = Array.from(props.words);
	var elements = null; 
	if (attrib=="Synonyms" || attrib=="Antonyms") {
			elements = words.map((word, index) =>  {
			return <button style={{"marginRight": "5px","marginBottom": "5px"}} key={index} type="button" className="btn btn-lg btn-secondary" data-container="body">{word}</button>
		});
	}
	return (
		elements && <div>
			{elements}
		</div>
	);

};

const Popperelement = (props) => {
	// reverse_empty_input:
	// reverse_ensw_input
	if(props.reverse_empty_input == true) {return (<div className="container"><h3>Empty Input</h3></div>)};
	if(props.reverse_ensw_input == true) {return (<div className="container"><h3>Input contains only english stop words</h3></div>)};
	// btn-success green color
	if (props.words !== null) {
		let noun = props.words.n ? Array.from(props.words.n).filter((value, index, self) => {return self.indexOf(value) == index;}) : null;
		// btn-warning orange color
		let adjective = props.words.a ? Array.from(props.words.a).filter((value, index, self) => {return self.indexOf(value) == index;}) : null;
		// btn-info light blue color
		let verb = props.words.v ? Array.from(props.words.v).filter((value, index, self) => {return self.indexOf(value) == index;}) : null;
		// btn-danger red color
		let adverb = props.words.s ? Array.from(props.words.s).filter((value, index, self) => {return self.indexOf(value) == index;}) : null;
		// let words = Array.from(props.words);
		let defs = Array.from(props.defs);
		var elements = [];
		var index_counter = 0;
		noun && noun.map((word, index) =>  {
			elements.push(<button style={{"marginRight": "5px","marginBottom": "5px"}} key={index_counter} type="button" className="btn btn-success btn-lg" title="dummy" data-container="body" data-toggle="popover" data-placement="top" data-content={defs}>{word}</button>)
			index_counter += 1;
		});

		adjective && adjective.map((word, index) =>  {
			elements.push(<button style={{"marginRight": "5px","marginBottom": "5px"}} key={index_counter} type="button" className="btn btn-lg btn-warning" title="dummy" data-container="body" data-toggle="popover" data-placement="top" data-content={defs}>{word}</button>)
			index_counter += 1;
		});


		verb && verb.map((word, index) =>  {
			elements.push(<button style={{"marginRight": "5px","marginBottom": "5px"}} key={index_counter} type="button" className="btn btn-lg btn-info" title="dummy" data-container="body" data-toggle="popover" data-placement="top" data-content={defs}>{word}</button>)
			index_counter += 1;
		});


		adverb && adverb.map((word, index) =>  {
	 		elements.push(<button style={{"marginRight": "5px","marginBottom": "5px"}} key={index_counter} type="button" className="btn btn-lg btn-danger" title="dummy" data-container="body" data-toggle="popover" data-placement="top" data-content={defs}>{word}</button>)
			index_counter += 1;
		});
	} else {
		var elements = <h3>Sorry couldn't find the word</h3>
	}
	return (
		<div className="container">
			<div>
				{elements}
			</div>
		</div>
	);

}

const ListDefinitions = (props) => {
	let elements = props.defs;
	var list_elements = elements.map((def, index) => {
		return <li key={`Definition ${index}`}>{def}</li>
	});
	return (
		<ul>
			{list_elements}
		</ul>
	);
}

const Innerpanel = (props) => {
	return (
		props.values && ((props.attrib == "Synonyms" || props.attrib == "Antonyms") ? 
		<div className="panel panel-default">
			<div className="panel-heading">{props.attrib}</div>
			<div className="panel-body">
				<Displaybuttons attrib={props.attrib} words={props.values}/>
			</div>
		</div>
		: 
		<div className="panel panel-default">
			<div className="panel-heading">{props.attrib}</div>
			<div className="panel-body">
				<ListDefinitions defs = {props.values}/>
				{/* {props.values} */}
			</div>
		</div>
	));
}

const Dictionarypanel = (props) => {
	if (props.dictionary_empty_input==true) {
		console.log("here");
		return (
			<div className="container">
				<h3>Empty Input</h3>
			</div>
		);
	};
	// facets => antonyms, definitions, partofspeech, synonyms, words
	let dictionary_search_word = props.dictionary_search_word;
	let words = props.words ? Array.from(props.words) : null;
	let antonyms = props.antonyms ? Array.from(props.antonyms) : null;
	let definitions = props.definitions ? Array.from(props.definitions) : null;
	let partofspeech = props.partofspeech ? Array.from(props.partofspeech) : null;
	let synonyms = props.synonyms ? Array.from(props.synonyms) : null;
	let dictionary_search_result_status = props.dictionary_search_result_status;
	if (definitions && partofspeech && definitions.length == partofspeech.length) {
		var def_pos = [];
		definitions.map((def, index) => {
		    def_pos.push(`${def}; ${partofspeech[index]}\n`);
		})
	} else {
		var def_pos = null;
	}

	
	
	// if no search word is entered
	if (dictionary_search_word == ''){
		return (<div></div>);
	}
	// if word searched for is not present in the dictionary
	else if (dictionary_search_result_status != '') {
		return (
			<div className="container">
				<h3>
					{dictionary_search_result_status}
				</h3>
			</div>
		);
	}
	else {
		return(
			// Root panel which houses all the other panels
			// panel heading is the dictionary_search word
			<div className="container">
				<div className="panel panel-default">
					<div className="panel-heading">{dictionary_search_word}</div>
					<div className="panel-body">

						{/* panel for definition*/}
						<Innerpanel attrib="Definitions and PartofSpeech" values={def_pos} />

						{/* panel for synonyms*/}
						<Innerpanel attrib="Synonyms" values={synonyms} />

						{/* panel for antonyms*/}
						<Innerpanel attrib="Antonyms" values={antonyms} />

					</div>
				</div>
			</div>
		)
	}
}


class ReverseDictionaryForm extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE };
		this.state.authUser = props.authUser;
		this.dictionaryResult.bind(this);
		this.reverseResult.bind(this);
	}

	componentDidUpdate() {
		$(function () {
			$('[data-toggle="popover"]').popover()
		})

		if (this.state.reverse_empty_input==false && this.state.reverse_ensw_input==false && this.state.dictionary_empty_input==false && this.state.authUser !== null) {
			var old_reverse = this.state.old_state.reverse;
			var old_dictionary = this.state.old_state.dictionary;
			if (old_reverse !== this.state.reverse_search_string) {
				var new_reverse = this.state.reverse_search_string;
				let info = {}
				info['reverse'] = new_reverse;
				info['pos'] = this.state.reverse_pos;
				db.writeUserData(this.state.authUser['uid'], new Date().toString(), info);
				this.setState({old_state:{'reverse':new_reverse, 'dictionary':old_dictionary}});
			}
			else if (old_dictionary!== this.state.dictionary_search_word) {
				var new_dictonary = this.state.dictionary_search_word;
				let info = {}
				info['dictionary'] = new_dictonary;
				db.writeUserData(this.state.authUser['uid'], new Date().toString(), info);
				this.setState({old_state:{'reverse':old_reverse, 'dictionary':new_dictonary}});
			}
		}
	}

	dictionaryResult = (event) => {
		var me = this;
		var word= document.getElementById("wname").value;
		// var value = document.getElementById("result");
		if (word === "") {this.setState({dictionary_empty_input:true})}
		else {
			var dbRef = db.getValues('dictionary/', word)

			// var x = document.getElementById("POS").value;

			dbRef.on('value', function(snapshot) { 
				var temp_val = snapshot.val()
				// facets => antonyms, definitions, partofspeech, synonyms, words
				temp_val!=undefined ? me.setState({ dictionary_empty_input:false, dictionary_search_word:word, result_definitions:temp_val.definitions, result_words:temp_val.words, result_antonyms:temp_val.antonyms, 
										result_partofspeech:temp_val.partofspeech, result_synonyms:temp_val.synonyms, dictionary_search_result_status:''}) : me.setState({dictionary_search_result_status: "Sorry couldn't find the word"});
			  // value.innerText= JSON.stringify(snapshot.val());
			});
		}

		event.preventDefault();
	}

	reverseResult = (event) => {

		var str= document.getElementById("rname").value;
		var ogstr = str;
		if (str === "") {this.setState({reverse_empty_input:true, reverse_ensw_input:false})}
		else {
			// english stop words
			let ensw = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]	
			str = str.split(" ").filter((e) => {return !ensw.includes(e)})
			str = str.join(" ");
			if (str === "") {this.setState({reverse_empty_input:false, reverse_ensw_input:true})}
			else {
				//Save search result
				//Hardcoded here but later use current logged in User

				// writeUserData(user,str);

				var pos = document.getElementById("POS_reverse").value;
				var words = str.split(" ");

				for (var i = 0; i < words.length; i++) {
					// if (pos === 'an'){
					// 	console.log('any');
					// 	var dbRef = db.getReverseValues('reverse',words[i], );
					// } else {
					db.getReverseValues(this, 'reverse', words[i], pos, (me, snapshot) => {
							me.setState({ reverse_pos:pos, reverse_search_string:ogstr, reverse_ensw_input:false, reverse_empty_input:false, reverse_words:snapshot });	
						}
					);
				}
			}
		}
		event.preventDefault();
	}

	render() {
		const {
			word,
			definition
		} = this.state;


		return (
			<div>
				<div className = "container">
					<form className="well form-horizontal" onSubmit={this.dictionaryResult}>
						<fieldset/>
						{/* <!-- Form Name --> */}
						<legend><center><h2><b>Dictionary</b></h2></center></legend><br/>
						<center>
   	   		  <div className="form-group">
							<label className="col-md-4 control-label">Enter the word:</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<input
										className="form-control"
										// value={email}
										// onChange={event => this.setState(byPropKey('email', event.target.value))}
										type="text"
										id="wname"
										// placeholder="Email Address"
									/>
								</div>
							</div>
						</div>

      	  <div className="form-group">
							<center>
      	  			{/* <button disabled={isInvalid} type="submit" className="btn btn-warning">
      	  			  Sign In<span className="glyphicon glyphicon-send"></span>
      	  			</button> */}
								<button type="submit" className="btn btn-warning">dict words</button>
							</center>
					</div>
					</center>

					</form>
				</div>

				{/* // facets => antonyms, definitions, partofspeech, synonyms, words */}
				<Dictionarypanel dictionary_search_word={this.state.dictionary_search_word} words={this.state.result_words} 
													synonyms={this.state.result_synonyms} antonyms={this.state.result_antonyms} definitions={this.state.result_definitions} 
													partofspeech={this.state.result_partofspeech} dictionary_search_result_status={this.state.dictionary_search_result_status}
													dictionary_empty_input={this.state.dictionary_empty_input}/>
				{/* <br/> */}
				<br/>

				<div className = "container">
					<form className="well form-horizontal" onSubmit={this.reverseResult}>
						<fieldset/>
						{/* <!-- Form Name --> */}
						<legend><center><h2><b>Reverse Dictionary</b></h2></center></legend><br/>
						<span className="label label-success">Noun</span>
						<span className="label label-warning">Adjective</span>
						<span className="label label-info">Verb</span>
						<span className="label label-danger">Adverb</span>

						<center>
						<div className="form-group">
							<label className="col-md-4 control-label">POS</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<select id="POS_reverse">
										<option value="an">Any</option>
									  <option value="n">Noun</option>
									  <option value="v">Verb</option>
									  <option value="a">Adjective</option>
									  <option value="s">Adverb</option>
									</select>
								</div>
							</div>
						</div>

   	   	  	<div className="form-group">
							<label className="col-md-4 control-label">Enter the definition of the word:</label>
							<div className="col-md-4 inputGroupContainer">
								<div className="input-group">
									<input
										className="form-control"
										// value={email}
										// onChange={event => this.setState(byPropKey('email', event.target.value))}
										type="text"
										id="rname"
										// placeholder="Email Address"
									/>
								</div>
							</div>
						</div>

      	  <div className="form-group">
							<center>
      	  			{/* <button disabled={isInvalid} type="submit" className="btn btn-warning">
      	  			  Sign In<span className="glyphicon glyphicon-send"></span>
      	  			</button> */}
								<button type="submit" className="btn btn-warning">define</button>
							</center>
					</div>
					</center>

					</form>
				</div>
				<br/>
				<Popperelement reverse_empty_input={this.state.reverse_empty_input} reverse_ensw_input={this.state.reverse_ensw_input} words={this.state.reverse_words} defs="dummy"/>

			</div>
		)
	}
}

export default LandingPage;