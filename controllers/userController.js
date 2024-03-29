const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const auth = require('../auth');
const debug = require('debug')('controller:user');

exports.user_detail = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userId).exec();
	res.send({ user });
});

exports.user_login = [
	body('username')
		.trim()
		.isLength({ min: 1, max: 100 }),
	body('password')
		.trim()
		.isLength({ min: 1, max: 100 }),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			debug(errors);
			return res.sendStatus(400);
		}

		const user = await User.findOne({ username: req.body.username });

		if (!user) return next();
		if (!await bcrypt.compare(req.body.password, user.password)) return next();

		res.json({
			username: user.username,
			accessToken: auth.generateAccessToken(user),
			refreshToken: await auth.generateRefreshToken(user)
		});
	})
];
