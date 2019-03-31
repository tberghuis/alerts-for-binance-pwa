import { combineReducers } from 'redux';
import auth from './auth';
import alertsList from './alertsList';

export default combineReducers({
	auth,
	alertsList
});
