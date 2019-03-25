import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Landing = (props) => {
	return (
		<div style={{ textAlign: 'center' }}>
			<Header as="h1">Alerts for Binance</Header>
			<p>Get real time cryptocurrency price alerts as a notification.</p>
			<p>
				<Button style={{ marginRight: '20px' }} as={Link} to="/login">
					Sign-in
				</Button>
				<Button as={Link} to="/register">
					Sign-up
				</Button>
			</p>
			<p>
				{props.showInstallButton && (
					<Button
						onClick={() => {
							window.beforeinstallpromptEvent.prompt();
							// Wait for the user to respond to the prompt
							window.beforeinstallpromptEvent.userChoice.then((choiceResult) => {
								if (choiceResult.outcome === 'accepted') {
									// console.log('User accepted the A2HS prompt');
									props.dispatch({ type: 'HIDE_INSTALL_HOMESCREEN' });
								} else {
									// console.log('User dismissed the A2HS prompt');
								}
								// not betting error on next click because maybe
								// chrome is firing new beforeinstallprompt after i cancel?
								window.beforeinstallpromptEvent = null;
							});
						}}
					>
						Add shortcut to home screen / desktop
					</Button>
				)}
			</p>
		</div>
	);
};

const mapStateToProps = (state) => ({
	showInstallButton: state.homescreen.showInstallButton
});

export default connect(mapStateToProps)(Landing);
