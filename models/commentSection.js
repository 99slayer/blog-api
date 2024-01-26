const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	timestamp: { type: Date, required: true },
	name: { type: String, required: true },
	text: { type: String, required: true },
}, { toJSON: { virtuals: true } });

CommentSchema.virtual('timestamp_formatted').get(function () {
	const dt = DateTime.fromJSDate(this.timestamp);
	return dt.toLocaleString(DateTime.DATE_SHORT) + ' ' + dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
});

const CommentSectionSchema = new Schema({
	comments: [
		{
			type: CommentSchema,
			default: {}
		}
	]
});

module.exports = mongoose.model('CommentSection', CommentSectionSchema);
