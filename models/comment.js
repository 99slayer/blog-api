const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	timestamp: { type: Date, required: true },
	text: { type: String, required: true },
});

CommentSchema.virtual('timestamp_formatted').get(function () {
	const dt = DateTime.fromJSDate(this.timestamp);
	return dt.toLocaleString(DateTime.DATE_SHORT) + ' ' + dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
})

module.exports = mongoose.model('Comment', CommentSchema);
