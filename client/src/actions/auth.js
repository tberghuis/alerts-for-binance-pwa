import axios from 'axios';
import history from '../history';
import jwt_decode from 'jwt-decode';
import { requestNotificationPermission } from '../configureNotifications';
import uuid from 'uuid/v4';

export default function authActions(setAuthState) {
	function loginWithToken(token) {
		localStorage.setItem('jwtToken', token);
		axios.defaults.headers.common['Authorization'] = token;
		setAuthState('LOGGED_IN');
		requestNotificationPermission();
		if (history.location.pathname === '/login' || history.location.pathname === '/') {
			history.push('/alertslist');
		}
	}
	function logout() {
		delete axios.defaults.headers.common['Authorization'];
		localStorage.removeItem('jwtToken');
		setAuthState('LOGGED_OUT');
		history.push('/');
	}

	function loginIfLocalStorageToken() {
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
		loginWithToken(localStorage.jwtToken);
	}

	async function loginAnon() {
		if (!localStorage.anonUuid) {
			// get uuid and save to storage
			localStorage.setItem('anonUuid', uuid());
		}

		// axios post login-anon
		try {
			const res = await axios.post('/api/users/login-anon', { anonUuid: localStorage.anonUuid });
			loginWithToken(res.data.token);
		} catch (resErr) {
			console.log('resErr', resErr);
			console.log('resErr.response', resErr.response);
		}
	}

	return { loginWithToken, logout, loginIfLocalStorageToken, loginAnon };
}
