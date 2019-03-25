const defaultState = {
	isAuthenticated: false
};

const auth = (state = defaultState, action) => {
	switch (action.type) {
		case 'SIGN_OUT':
			return { isAuthenticated: false };
		case 'SIGN_IN':
			return { isAuthenticated: true };
		default:
			return state;
	}
};

export default auth;
