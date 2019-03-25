const defaultState = {
	showInstallButton: false
};

const auth = (state = defaultState, action) => {
	switch (action.type) {
		case 'SHOW_INSTALL_HOMESCREEN':
			return { showInstallButton: true };
		case 'HIDE_INSTALL_HOMESCREEN':
			return { showInstallButton: false };
		default:
			return state;
	}
};

export default auth;
