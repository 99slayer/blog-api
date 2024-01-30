const Post = require('../models/post');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('controller:comment');

exports.comment_list = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.postId).populate('comment_section');
	const comments = post['comment_section'].comments;
	return res.json(comments);
});

exports.comment_create_post = [
	body('comment-name')
		.trim()
		.isLength({ min: 1, max: 60 }),
	body('comment-text')
		.trim()
		.isLength({ min: 1, max: 500 }),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			debug(errors);
			return res.sendStatus(400);
		}

		const post = await Post.findById(req.params.postId).populate('comment_section');

		if (post == undefined) {
			debug('No post document found.');
			return res.sendStatus(404);
		}

		post['comment_section'].comments.push({
			timestamp: new Date,
			name: req.body['comment-name'],
			text: req.body['comment-text']
		});
		await post['comment_section'].save();
		return res.sendStatus(200);
	})
];

exports.comment_delete = asyncHandler(async (req, res, next) => {

});
