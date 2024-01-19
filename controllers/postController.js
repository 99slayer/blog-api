const Post = require('../models/post');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.post_list = asyncHandler(async (req, res, next) => {
	const posts = await Post.find({}).populate('creator');
	res.json({ posts });
});

exports.post_detail = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.postId);
	res.json({ post });
});

exports.post_create_post = [
	asyncHandler(async (req, res, next) => {
		const creator = await User.findOne({ username: req.headers.username });

		const post = new Post({
			title: req.body.title,
			posted_timestamp: new Date(),
			text: req.body.text,
			creator: creator._id
		});

		await post.save();

		res.sendStatus(200);
	})
];

exports.post_update = [
	asyncHandler(async (req, res, next) => {
		const updatedPost = await Post.findOneAndUpdate(
			{ _id: req.params.postId },
			{
				title: req.body.title,
				text: req.body.text
			},
			{
				new: true
			}
		);

		if (updatedPost == null) return res.sendStatus(404);

		return res.sendStatus(200);
	})
];

exports.post_publish = [
	asyncHandler(async (req, res, next) => {
		const post = await Post.findById({ _id: req.params.postId });
		const updatedPost = await Post.findOneAndUpdate(
			{ _id: req.params.postId },
			{
				published_timestamp: (post.published ? null : new Date()),
				published: (post.published ? false : true)
			},
			{ new: true }
		);

		if (updatedPost == null) return res.sendStatus(404);

		return res.sendStatus(200);
	})
];

exports.post_delete = asyncHandler(async (req, res, next) => {
	const post = await Post.findByIdAndDelete(req.params.postId);

	if (!post) {
		res.sendStatus(500);
	} else {
		res.sendStatus(200);
	}
});
