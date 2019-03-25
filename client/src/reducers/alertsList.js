const alertsList = (state = [], action) => {
	switch (action.type) {
		case 'ALERTS_LIST_FETCH':
			return [ ...action.payload ];
		case 'ALERTS_LIST_ADD':
			return [ ...state, action.payload ];
		case 'ALERTS_LIST_REMOVE':
			return state.filter((alert) => alert.id !== action.id);
		default:
			return state;
	}
};

export default alertsList;
