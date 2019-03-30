// is there anything wrong with getting dispatch directly from the store as opposed to using thunk or dispatch from props?
import { dispatch } from '../store';
import axios from 'axios';
import history from '../history';
import jwt_decode from 'jwt-decode';
import { requestNotificationPermission } from '../configureNotifications';
import uuid from 'uuid/v4';

export function login(token) {
	localStorage.setItem('jwtToken', token);
	axios.defaults.headers.common['Authorization'] = token;
	dispatch({ type: 'SIGN_IN' });
	requestNotificationPermission();
	if (history.location.pathname === '/login' || history.location.pathname === '/') {
		history.push('/alertslist');
	}
}

export function logout() {
	// delete auth header
	delete axios.defaults.headers.common['Authorization'];
	localStorage.removeItem('jwtToken');
	dispatch({ type: 'SIGN_OUT' });
	history.push('/');
}

export function loginIfLocalStorageToken() {
	if (!localStorage.jwtToken) {
		return;
	}

	// check token still valid
	const decoded = jwt_decode(localStorage.jwtToken);
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// TODO test this function
		logout();
		return;
	}
	login(localStorage.jwtToken);
}

// call from landing page
export async function loginAnon() {
	if (!localStorage.anonUuid) {
		// get uuid and save to storage
		localStorage.setItem('anonUuid', uuid());
	}

	// axios post login-anon
	try {
		const res = await axios.post('/api/users/login-anon', { anonUuid: localStorage.anonUuid });
		login(res.data.token);
	} catch (resErr) {
		console.log('resErr', resErr);
		console.log('resErr.response', resErr.response);
	}
}
