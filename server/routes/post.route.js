const PostController = require('../controller/post.controller');
const UserMiddleware = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/create-post', UserMiddleware.protect, PostController.createPost);
router.get('/my-posts', UserMiddleware.protect, PostController.myPosts);
router.get('/all-posts',  PostController.allPosts);

module.exports = router;
