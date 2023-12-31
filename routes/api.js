const express = require('express');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const router = express.Router();

// USERS
router.get('/users/:userId', userController.user_detail);
router.post('/users/login', userController.user_login);

// POSTS
router.get('/posts', postController.post_list);
router.post('/posts', postController.post_create_post);

router.get('/posts/:postId', postController.post_detail);
router.put('/posts/:postId', postController.post_update);
router.delete('/posts/:postId', postController.post_delete);

// COMMENTS
router.get('/comments', commentController.comment_list);
router.post('/comments', commentController.comment_create_post);
router.delete('/comments/:commentId', commentController.comment_delete);

module.exports = router;
