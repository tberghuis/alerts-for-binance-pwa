import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { loginAnon } from '../actions/auth';

let beforeinstallpromptEvent = null;

export default function Landing() {
	const [ showInstallHomescreen, setShowInstallHomescreen ] = useState(false);

	// run on didMount
	useEffect(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			beforeinstallpromptEvent = e;
			setShowInstallHomescreen(true);
		});
	}, []);

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
				<Button onClick={loginAnon}>Anonymously Sign-in</Button>
			</p>
			<p>
				{showInstallHomescreen && (
					<Button
						onClick={() => {
							beforeinstallpromptEvent.prompt();
							beforeinstallpromptEvent.userChoice.then((choiceResult) => {
								if (choiceResult.outcome === 'accepted') {
									setShowInstallHomescreen(false);
								}
							});
						}}
					>
						Add shortcut to home screen / desktop
					</Button>
				)}
			</p>
		</div>
	);
}
