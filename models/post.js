const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true },
	posted_timestamp: { type: Date, required: true },
	published_timestamp: { type: Date, default: null },
	text: { type: String, required: true },
	creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	published: { type: Boolean, default: false, required: true },
}, { toJSON: { virtuals: true } });

PostSchema.virtual('posted_timestamp_formatted').get(function () {
	const dt = DateTime.fromJSDate(this.posted_timestamp);
	return dt.toLocaleString(DateTime.DATE_SHORT) + ' ' + dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
});

PostSchema.virtual('published_timestamp_formatted').get(function () {
	const dt = DateTime.fromJSDate(this.published_timestamp);
	return dt.toLocaleString(DateTime.DATE_SHORT) + ' ' + dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
});

module.exports = mongoose.model('Post', PostSchema);
