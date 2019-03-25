import firebase from 'firebase/app';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

// do i need
messaging.usePublicVapidKey(process.env.REACT_APP_MESSAGING_VAPID_KEY);

export { firebase, messaging };
