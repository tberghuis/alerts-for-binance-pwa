import axios from 'axios';

export default function alertsActions(alertsDispatch) {
	async function fetchAlerts() {
		try {
			const res = await axios.get('/api/alerts');
			alertsDispatch({ type: 'ALERTS_LIST_FETCH', payload: res.data });
		} catch (error) {
			console.log('error', error);
		}
	}

	// don't catch so errors can be handled by component
	async function addAlert(alertData) {
		const res = await axios.post('/api/alerts/new', alertData);
		console.log('res.data.alert',res.data.alert);
		alertsDispatch({ type: 'ALERTS_LIST_ADD', payload: res.data.alert });
	}

	async function removeAlert(id) {
		try {
			await axios.delete(`/api/alerts/${id}`);
			alertsDispatch({ type: 'ALERTS_LIST_REMOVE', id });
		} catch (error) {
			console.log('error', error);
		}
	}

	return { fetchAlerts, removeAlert, addAlert };
}
