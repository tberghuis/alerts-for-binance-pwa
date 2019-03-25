import { dispatch } from '../store';
import axios from 'axios';

export async function fetchAlerts() {
	try {
		const res = await axios.get('/api/alerts');
		dispatch({ type: 'ALERTS_LIST_FETCH', payload: res.data });
	} catch (error) {
		console.log('error', error);
	}
}

// add alert, i am dispatching from AddAlert component
// export async function addAlert() {
// 	console.log('addAlert');
// }

export async function removeAlert(id) {
	try {
		await axios.delete(`/api/alerts/${id}`);
		dispatch({ type: 'ALERTS_LIST_REMOVE', id });
	} catch (error) {
		console.log('error', error);
	}
}
