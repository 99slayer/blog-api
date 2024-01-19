const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const auth = require('../auth');

exports.user_detail = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.userId).exec();
	res.send({ user });
});

exports.user_login = [
	asyncHandler(async (req, res, next) => {
		const user = await User.findOne({ username: req.body.username });

		if (!user) return next();
		if (req.body.password !== user.password) return next();

		res.json({
			username: user.username,
			accessToken: auth.generateAccessToken(user),
			refreshToken: await auth.generateRefreshToken(user)
		});
	})
];
