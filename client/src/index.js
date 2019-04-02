import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { Router } from 'react-router-dom';
import history from './history';
import { setupOnTokenRefresh } from './configureNotifications';

import 'semantic-ui-css/semantic.min.css';
import './css/style.css';

setupOnTokenRefresh();

render(
	<Router history={history}>
		<App />
	</Router>,
	document.getElementById('root')
);
