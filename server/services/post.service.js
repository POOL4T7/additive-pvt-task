// services/postService.js
const Post = require('../models/post.model');

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

  getUserPosts: async function (filter = {}) {
    try {
      // Finding all posts that match the filter criteria.
      const data = await Post.find(filter).lean();
      return data;
    } catch (e) {
      throw new Error(`Error fetching posts: ${e.message}`);
    }
  },
  getAllPosts: async function () {
    try {
      const latestPosts = await Post.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: '$userId',
            latestPost: { $push: '$$ROOT' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: {
            path: '$userDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            latestPost: 1,
            userDetails: 1,
          },
        },
      ]);

      return latestPosts;
    } catch (error) {
      console.error('Error fetching latest posts grouped by user:', error);
      throw error;
    }
  },
};

module.exports = PostServices;
