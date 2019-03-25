import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './Navbar';
import Landing from './Landing';
import AlertsList from './AlertsList';
import AddAlert from './AddAlert';
import { Container } from 'semantic-ui-react';
import { fetchAlerts } from '../actions/alerts';

class App extends Component {
	render() {
		return (
			<div>
				<Container>
					<Navbar />
					<Route exact path="/" component={Landing} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route
						exact
						path="/alertslist"
						render={() => {
							fetchAlerts();
							return <AlertsList />;
						}}
					/>
					<Route exact path="/addalert" component={AddAlert} />
				</Container>
			</div>
		);
	}
}

export default App;
