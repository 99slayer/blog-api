require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const debug = require('debug')('auth');

const RefreshTokenSchema = new mongoose.Schema({
	refresh_token: { type: String, required: true }
});
const RefreshToken = mongoose.model(
	'token',
	RefreshTokenSchema
);

// Send with access token and refresh token.
function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(400);

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET,
		(err, authData) => {
			if (err) {
				debug(err);
				return res.sendStatus(401);
			} else {
				next();
			}
		}
	);
};

// Attempts to renew user access using a refresh token.
async function refreshToken(req, res, next) {
	if (req.headers.refreshtoken == null) return res.sendStatus(400);

	const tokens = await RefreshToken.find({});
	const authHeader = req.headers.refreshtoken;
	const token = authHeader.split('=')[1];
	const tokenList = [];
	tokens.forEach(x => tokenList.push(x['refresh_token']));

	if (token == null) return res.sendStatus(400);
	if (!tokenList.includes(token)) return res.sendStatus(401);

	jwt.verify(
		token,
		process.env.REFRESH_TOKEN_SECRET,
		(err, authData) => {
			if (err) {
				debug(err);
				if (err.name === 'TokenExpiredError') deleteRefreshToken(req, res, next);
				return res.sendStatus(401);
			} else {
				const user = authData.user;
				const accessToken = generateAccessToken(user);
				res.json({ accessToken });
			}
		}
	);
};

function generateAccessToken(user) {
	return jwt.sign(
		{ user },
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '30s' }
	)
};

async function generateRefreshToken(user) {
	const token = jwt.sign(
		{ user },
		process.env.REFRESH_TOKEN_SECRET
	);

	const refreshToken = new RefreshToken({
		refresh_token: token
	});

	const tokens = await RefreshToken.find({});
	const tokenList = [];

	tokens.forEach((token) => {
		tokenList.push(token.refresh_token);
	});

	if (!tokenList.includes(token)) {
		await refreshToken.save();
	}

	return token;
};

async function deleteRefreshToken(req, res, next) {
	const authHeader = req.headers.refreshtoken;
	const token = authHeader.split('=')[1];
	debug('Revoking access refresh.')

	if (token == null) return res.sendStatus(400);

	const removedToken = await RefreshToken.findOneAndDelete({
		refresh_token: token
	});

	if (removedToken == null) return res.sendStatus(404);

	return res.sendStatus(200);
};

// Clears all refresh tokens from the DB.
async function clearRefreshTokens(req, res, next) {
	const tokens = await RefreshToken.deleteMany({});
	res.json({ tokens })
};

module.exports = {
	verifyToken,
	refreshToken,
	generateAccessToken,
	generateRefreshToken,
	deleteRefreshToken,
	clearRefreshTokens
};
