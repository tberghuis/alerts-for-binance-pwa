import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './components/App';
import { Router } from 'react-router-dom';
import history from './history';
import { loginIfLocalStorageToken } from './actions/auth';
import { setupOnTokenRefresh } from './configureNotifications';

import 'semantic-ui-css/semantic.min.css';
import './css/style.css';

loginIfLocalStorageToken();
setupOnTokenRefresh();

render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById('root')
);

window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	e.preventDefault();
	// Stash the event so it can be triggered later.
	window.beforeinstallpromptEvent = e;
	store.dispatch({ type: 'SHOW_INSTALL_HOMESCREEN' });
});
