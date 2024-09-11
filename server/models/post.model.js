const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'blocked'] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
