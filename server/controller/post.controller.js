const PostService = require('../services/post.service');

const PostController = {
  createPost: async function (req, res) {
    try {
      const data = await PostService.addPost({
        ...req.body,
        userId: req.sessionDetails._id,
      });
      return res.status(201).json({
        success: true,
        message: 'post added',
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
  myPosts: async function (req, res) {
    try {
      const posts = await PostService.getUserPosts({
        userId: req.sessionDetails._id,
      });
      return res.status(200).json({
        success: true,
        message: 'user post List',
        postList: posts,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
  allPosts: async function (req, res) {
    try {
      const posts = await PostService.getAllPosts();
      return res.status(200).json({
        success: true,
        message: 'user post List',
        postList: posts,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'server error, please try again',
        error: e.message,
      });
    }
  },
};

module.exports = PostController;
