const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const isEmpty = require('lodash/isEmpty');
const isNil = require('lodash/isNil');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already exists';
			return res.status(400).json(errors);
		}
		const newUser = new User({
			email: req.body.email,
			password: req.body.password
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser.save().then((user) => res.json(user)).catch((err) => console.log(err));
			});
		});
	});
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email }).then((user) => {
		if (!user) {
			errors.email = 'User not found';
			return res.status(404).json(errors);
		}

		// Check Password
		bcrypt.compare(password, user.password).then((isMatch) => {
			if (isMatch) {
				const payload = { id: user.id }; // Create JWT Payload
				jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }, (err, token) => {
					res.json({
						success: true,
						token: 'bearer ' + token
					});
				});
			} else {
				errors.password = 'Password incorrect';
				return res.status(400).json(errors);
			}
		});
	});
});

// @route   POST api/users/login-anon
// @desc    Login Anon User / Returning JWT Token
// @access  Public
router.post('/login-anon', async (req, res) => {
	const anonUuid = req.body.anonUuid;
	// validate anonUuid
	// check exists
	if (isNil(anonUuid) || isEmpty(anonUuid)) {
		return res.status(400).json();
	}
	try {
		let user = await User.findOne({ anonUuid }).exec();
		if (!user) {
			// create a fresh user
			const anonUser = new User({
				anonUuid
			});
			user = await anonUser.save();
		}
		const payload = { id: user.id }; // Create JWT Payload
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }, (err, token) => {
			res.json({
				success: true,
				token: 'bearer ' + token
			});
		});
	} catch (error) {
		console.log('error', error);
	}
});

// @route   POST api/users/notification-token
// @desc    add notification token for logged in user
// @access  Private
router.post('/notification-token', passport.authenticate('jwt', { session: false }), async (req, res) => {
	try {
		const user = await User.findById(req.user.id).exec();

		// if token already exists, res 400 error already exists
		if (user.notificationTokens.indexOf(req.body.notificationToken) > -1) {
			return res.status(400).json({ error: 'notification token already exists' });
		}
		user.notificationTokens.push(req.body.notificationToken);
		// await is to catch errors
		await user.save();
		res.json();
	} catch (error) {
		res.status(400).json(error);
		console.log('error', error);
	}
});

module.exports = router;
