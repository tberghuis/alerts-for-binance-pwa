const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Alert = require("../../models/Alert");
const allCurrentPrices = require("../../binancepriceproxy").allCurrentPrices;
const isEmpty = require("lodash/isEmpty");

// @route   GET api/alerts
// @desc    get all alerts for logged in user
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const alerts = await Alert.find({ user: req.user.id }).exec();
    const resData = [];
    alerts.forEach(({ id, pairing, price, alertType }) => {
      resData.push({
        id,
        pairing,
        price,
        alertType,
        currentPrice: allCurrentPrices[pairing]
      });
    });
    res.json(resData);
  }
);

// @route   POST api/alerts/new
// @desc    Adds an alert to users watchlist
// @access  Private
router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const alert = {
      ...req.body,
      user: req.user.id
    };
    const validationErrors = {};
    const currentPrice = allCurrentPrices[alert.pairing];
    if (!currentPrice) {
      validationErrors.pairing = `Pairing ${alert.pairing} not valid`;
    } else if (
      (alert.alertType === "BUY" && currentPrice < alert.price) ||
      (alert.alertType === "SELL" && currentPrice > alert.price)
    ) {
      validationErrors.alertType = `${
        alert.alertType
      } alert does not make sense for current price ${currentPrice}`;
    }

    if (!isEmpty(validationErrors)) {
      res.status(400).json(validationErrors);
      return;
    }

    try {
      const newAlert = await new Alert(alert).save();
      const resData = {
        alert: {
          id: newAlert.id,
          pairing: newAlert.pairing,
          price: newAlert.price,
          currentPrice
        }
      };

      res.json(resData);
    } catch (error) {
      console.log("error", error);
      res.status(400).json(error);
    }
  }
);

// @route   DELETE api/alerts/:alertId
// @desc    Removes an alert from users alert list
//          makes sure user owns alert
// @access  Private
router.delete(
  "/:alertId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const alert = await Alert.findOneAndRemove({
        _id: req.params.alertId,
        user: req.user.id
      });
      if (!alert) {
        res.status(400).json({
          error: `no alert with id: ${req.params.alertId}, user: ${
            req.user.id
          } found to delete`
        });
        return;
      }
      res.json({ success: true });
    } catch (error) {
      console.log("error", error);
      res.status(400).json(error);
    }
  }
);

module.exports = router;
