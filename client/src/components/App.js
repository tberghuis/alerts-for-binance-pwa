import React, { useState, useEffect, useReducer } from 'react';
import { Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Navbar from './Navbar';
import Landing from './Landing';
import AlertsList from './AlertsList';
import AddAlert from './AddAlert';
import { Container } from 'semantic-ui-react';
import authActions from '../actions/auth';
import getAlertsActionHandlers from '../actions/alerts';
import alertsListReducer from '../reducers/alertsList';

export default function App() {
	const [ alertsState, alertsDispatch ] = useReducer(alertsListReducer, []);
	const alertsActions = getAlertsActionHandlers(alertsDispatch);
	const [ authState, setAuthState ] = useState('LOGGED_OUT');
	const { login, logout, loginIfLocalStorageToken, loginAnon } = authActions(setAuthState);

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
						return <Landing logout={logout} authState={authState} {...routeProps} loginAnon={loginAnon} />;
					}}
				/>
				<Route exact path="/register" component={Register} />
				<Route
					exact
					path="/login"
					render={(routeProps) => {
						return <Login {...routeProps} login={login} />;
					}}
				/>
				<Route
					exact
					path="/alertslist"
					render={() => {
						return (
							<AlertsList alertsState={alertsState} alertsActions={alertsActions} authState={authState} />
						);
					}}
				/>
				<Route
					exact
					path="/addalert"
					render={(routeProps) => {
						return (
							<AddAlert
								{...routeProps}
								addAlert={alertsActions.addAlert}
								alertsDispatch={alertsDispatch}
							/>
						);
					}}
				/>
			</Container>
		</div>
	);
}
