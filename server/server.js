require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const setupFetchAllCurrentPricesInterval = require('./binancepriceproxy').setupFetchAllCurrentPricesInterval;
const processalerts = require('./processalerts');

const app = express();

const users = require('./routes/api/users');
const alerts = require('./routes/api/alerts');

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

// make sure allCurrentPrices is populated before serving a request
setupFetchAllCurrentPricesInterval().then(() => {
	app.listen(port, () => console.log(`Server listening on port ${port}`));
	processalerts();
});

// TODO something to catch uncaught errors???
// let pm2 restart the process, server error logging
