const axios = require('axios');

const allCurrentPrices = {};

async function fetchAllCurrentPrices() {
	try {
		const res = await axios.get('https://api.binance.com/api/v1/ticker/allPrices');
		res.data.forEach((pair) => {
			allCurrentPrices[pair.symbol] = Number(pair.price);
		});
	} catch (error) {
		console.log('error', error);
	}
}

async function setupFetchAllCurrentPricesInterval() {
	setInterval(() => fetchAllCurrentPrices(), Number(process.env.FETCH_PRICE_INTERVAL));
	await fetchAllCurrentPrices();
}

module.exports = { allCurrentPrices, setupFetchAllCurrentPricesInterval };
