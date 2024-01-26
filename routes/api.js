const express = require('express');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const auth = require('../auth');

const router = express.Router();

// USERS
router.post('/users/login', userController.user_login);
router.get('/users/token', auth.refreshToken);
router.delete('/users/logout', auth.deleteRefreshToken);
router.get('/users/:userId', userController.user_detail);

// POSTS
router.get('/posts', postController.post_list);
router.post(
	'/posts',
	auth.verifyToken,
	postController.post_create_post
);

router.get('/posts/:postId', postController.post_detail);
router.put('/posts/:postId',
	auth.verifyToken,
	postController.post_update
);
router.delete('/posts/:postId',
	auth.verifyToken,
	postController.post_delete
);
router.put('/posts/:postId/publish',
	auth.verifyToken,
	postController.post_publish
);

// COMMENTS
router.get('/posts/:postId/comments', commentController.comment_list);
router.post('/posts/:postId/comments', commentController.comment_create_post);
router.delete('/posts/:postid/comments/:commentId', commentController.comment_delete);

module.exports = router;
