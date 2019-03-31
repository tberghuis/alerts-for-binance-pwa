import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './Navbar';
import Landing from './Landing';
import AlertsList from './AlertsList';
import AddAlert from './AddAlert';
import { Container } from 'semantic-ui-react';
import authActions from '../actions/auth';

export default function App() {
	const [ authState, setAuthState ] = useState('LOGGED_OUT');
	const { loginWithToken, logout, loginIfLocalStorageToken, loginAnon } = authActions(setAuthState);

	useEffect(() => {
		loginIfLocalStorageToken();
	}, []);

	return (
		<div>
			<Container>
				<Navbar authState={authState} logout={logout} />
				<Route
					exact
					path="/"
					render={(routeProps) => {
						return <Landing {...routeProps} loginAnon={loginAnon} />;
					}}
				/>
				<Route exact path="/register" component={Register} />
				<Route
					exact
					path="/login"
					render={(routeProps) => {
						return <Login {...routeProps} login={loginWithToken} />;
					}}
				/>
				<Route
					exact
					path="/alertslist"
					render={() => {
						return <AlertsList authState={authState} />;
					}}
				/>
				<Route exact path="/addalert" component={AddAlert} />
			</Container>
		</div>
	);
}
