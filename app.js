const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const apiRouter = require('./routes/api');
const testRouter = require('./routes/test');

const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.PROD_DB_URI || process.env.TEST_DB_STRING;

main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
}

app.use(compression());
app.use(helmet());

const limit = require('express-rate-limit');
const limiter = limit({
	windowMs: 60000,
	max: 40
});
app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
	origin: [
		'http://127.0.0.1:5500',
		'http://127.0.0.1:5173'
	]
}));
app.use(cookieParser());

app.use('/api', apiRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json({ error: err });
});

module.exports = app;
