import { combineReducers } from 'redux';
import auth from './auth';
import alertsList from './alertsList';
import homescreen from './homescreen';

export default combineReducers({
	auth,
	alertsList,
	homescreen
});
