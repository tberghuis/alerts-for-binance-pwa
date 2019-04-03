const express = require('express');
const router = express.Router();

const allCurrentPrices = require('../../binancepriceproxy').allCurrentPrices;

// @route   GET api/pairings
// @desc    get list of pairings
// @access  Public
router.get('/', (req, res) => {
	res.json(Object.keys(allCurrentPrices));
});

module.exports = router;
