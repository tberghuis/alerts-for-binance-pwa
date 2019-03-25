const allCurrentPrices = require('./binancepriceproxy').allCurrentPrices;
const User = require('./models/User');
const Alert = require('./models/Alert');
const admin = require('firebase-admin');
const serviceAccount = require(`./${process.env.FIREBASE_SERVICE_ACCOUNT_KEYS}`);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

// mongodb was a mistake, next project postgresql
async function sendNotificationsIfAlertConditionMet() {
	try {
		const users = await User.find({ notificationTokens: { $gt: [] } }).exec();

		const userTokens = {}; // format {userid:[tokens]}
		const tokensToRemove = [];

		// a relational db would be easier to query
		// i could also use aggregate
		users.forEach((user) => {
			userTokens[user.id] = [];
			user.notificationTokens.forEach((token) => userTokens[user.id].push(token));
		});

		// find all alerts
		const alerts = await Alert.find({}).exec();
		alerts.forEach(async ({ id, user, pairing, price, alertType }) => {
			if (
				(alertType === 'BUY' && allCurrentPrices[pairing] > price) ||
				(alertType === 'SELL' && allCurrentPrices[pairing] < price)
			) {
				return;
			}
			// alert condition is met

			// TODO add the favicon.png
			const payload = {
				notification: {
					title: 'Alerts for Binance',
					body:
						`${alertType} alert for ${pairing}.\n` +
						`target: ${price}, current ${allCurrentPrices[pairing]}`,
					click_action: `https://www.binance.com/trade.html?symbol=${pairing}`,
					requireInteraction: 'true'
				}
			};
			try {
				const notifRes = await admin.messaging().sendToDevice(userTokens[user], payload);

				// remove alert if any success
				if (notifRes.successCount > 0) {
					console.log('id', id);
					Alert.findOneAndRemove({ _id: id }).exec();
				}

				// mark token for removal if failure invalid...
				// https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js
				notifRes.results.forEach((result, index) => {
					const error = result.error;
					// Cleanup the tokens who are not registered anymore.
					if (
						error &&
						(error.code === 'messaging/invalid-registration-token' ||
							error.code === 'messaging/registration-token-not-registered')
					) {
						tokensToRemove.push(userTokens[user][index]);
					}
				});
			} catch (error) {
				console.log('error', error);
			}
		});

		// TODO test remove bad tokens
		await User.updateMany({}, { $pullAll: { notificationTokens: tokensToRemove } }).exec();
	} catch (error) {
		console.log('error', error);
	}
}

function runProcessAlertsInterval() {
	sendNotificationsIfAlertConditionMet();
	setInterval(() => sendNotificationsIfAlertConditionMet(), Number(process.env.PROCESS_ALERTS_INTERVAL));
}

module.exports = runProcessAlertsInterval;
