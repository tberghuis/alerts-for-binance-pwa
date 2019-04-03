require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const setupFetchAllCurrentPricesInterval = require('./binancepriceproxy').setupFetchAllCurrentPricesInterval;
const processalerts = require('./processalerts');

const app = express();

const users = require('./routes/api/users');
const alerts = require('./routes/api/alerts');
const pairings = require('./routes/api/pairings');
const price = require('./routes/api/price');

const port = process.env.PORT || 5050;

mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true })
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/alerts', alerts);
app.use('/api/pairings', pairings);
app.use('/api/price', price);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('../client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
	});
}

// make sure allCurrentPrices is populated before serving a request
setupFetchAllCurrentPricesInterval().then(() => {
	app.listen(port, () => console.log(`Server listening on port ${port}`));
	processalerts();
});
