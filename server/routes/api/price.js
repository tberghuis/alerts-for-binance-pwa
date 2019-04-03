const express = require("express");
const router = express.Router();

const allCurrentPrices = require("../../binancepriceproxy").allCurrentPrices;

// @route   GET api/price/:pairingSymbol
// @desc    get the price for pairing
// @access  Public
router.get("/:pairingSymbol", (req, res) => {
  res.json({ price: allCurrentPrices[req.params.pairingSymbol] });
});

module.exports = router;
