import React, { useEffect, useState } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

let beforeinstallpromptEvent = null;

export default function Landing({ loginAnon }) {
	const [ showInstallHomescreen, setShowInstallHomescreen ] = useState(false);

	const handleInstallHomescreen = () => {
		beforeinstallpromptEvent.prompt();
		beforeinstallpromptEvent.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				setShowInstallHomescreen(false);
			}
		});
	};

	const handleBeforeinstallprompt = (e) => {
		e.preventDefault();
		beforeinstallpromptEvent = e;
		setShowInstallHomescreen(true);
	};

	// run on didMount
	useEffect(() => {
		window.addEventListener('beforeinstallprompt', handleBeforeinstallprompt);
		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeinstallprompt);
		};
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
					<Button onClick={handleInstallHomescreen}>Add shortcut to home screen / desktop</Button>
				)}
			</p>
		</div>
	);
}
