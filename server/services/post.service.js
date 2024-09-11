// services/postService.js
const Post = require('../models/postModel');

// PostServices object containing methods to handle post-related database operations
const PostServices = {
  addPost: async function (formData) {
    try {
      // Creating a new Post instance with the provided data.
      const post = new Post(formData);
      // Saving the new post to the database.
      return await post.save();
    } catch (e) {
      throw new Error(`Error adding post: ${e.message}`);
    }
  },

  //   updatePost: async function (filter, updatedValue) {
  //     try {
  //       const data = await Post.findOneAndUpdate(
  //         filter,
  //         { $set: updatedValue },
  //         { new: true }
  //       );
  //       return data;
  //     } catch (e) {
  //       throw new Error(`Error updating post: ${e.message}`);
  //     }
  //   },

  getAllPosts: async function (filter = {}) {
    try {
      // Finding all posts that match the filter criteria.
      const data = await Post.find(filter).lean();
      return data;
    } catch (e) {
      throw new Error(`Error fetching posts: ${e.message}`);
    }
  },
};

module.exports = PostServices;
