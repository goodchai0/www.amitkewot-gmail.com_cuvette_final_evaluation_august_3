const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who created the story
  },
  slides: [{
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Food', 'Health & Fitness', 'Travel', 'Movie', 'Education'],
      required: true,
    },
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Users who liked
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Users who bookmarked the story
  }],
}, {
  timestamps: true,
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
