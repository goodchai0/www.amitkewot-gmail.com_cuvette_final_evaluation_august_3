const Story = require('../models/storyModel.js');

//create story 
const makeStory = async (req ,res) =>{
  const { userId } = req.user; // Extract user ID from authd user
  const { slides } = req.body;

  if (!slides || slides.length < 3 || slides.length > 6) {
    return res.status(400).json({ success: false, error: 'Number of slides should be between 3 and 6' });
  }

  try {
    const newStory = await Story.create({ userId, slides });
    res.status(201).json({ success: true, message: 'Story created successfully', data: newStory });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create story', data: error.message });
  }
}

// Get all stories
const getAll = async (req, res) => {
    try {
        const stories = await Story.find().populate('userId', 'username');
        res.status(200).json({ success: true, data: stories });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch stories', data: error.message });
    }
};


// View a specific story
const viewStory = async (req, res) => {
  const { storyId } = req.params;
  const { userId } = req.user; // Extract user ID from authd user

  try {
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }

    // Check if the current user has liked the story
    const isLiked = story.likes.includes(userId);

    // Check if the current user has bookmarked the story
    const isBookmarked = story.bookmarks.includes(userId);

    res.status(200).json({ success: true, data: { story, isLiked, isBookmarked } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch story', data: error.message });
  }
};


// Edit a story
const editStory = async (req, res) => {
    const { storyId} = req.params;
    const { userId } = req.user; // Extract user ID from authd user
    const { slides } = req.body;
  
    try {
      let story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ success: false, error: 'Story not found' });
      }
      if (String(story.userId) !== userId) {
        return res.status(403).json({ success: false, error: 'You are not authorized to edit this story' });
      }
      if (!slides || slides.length < 3 || slides.length > 6) {
        return res.status(400).json({ success: false, error: 'Number of slides should be between 3 and 6' });
      }
      story.slides = slides;
      await story.save();
      res.status(200).json({ success: true, message: 'Story updated successfully', data: story });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update story', data: error.message });
    }
  };
  
  // Like a story
const likeStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user; // Extract user ID from authd user
  
    try {
      let story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ success: false, error: 'Story not found' });
      }
      if (story.likes.includes(userId)) {
        return res.status(400).json({ success: false, error: 'You have already liked this story' });
      }
      story.likes.push(userId);
      await story.save();
      res.status(200).json({ success: true, message: 'Story liked successfully', data: story });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to like story', data: error.message });
    }
  };
  
  // Bookmark a story
  const bookmarkStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user; // Extract user ID from authd user
  
    try {
      // console.log({id,userId})
      let story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ success: false, error: 'Story not found' });
      }
      if (story.bookmarks.includes(userId)) {
        return res.status(400).json({ success: false, error: 'You have already bookmarked this story' });
      }
      story.bookmarks.push(userId);
      await story.save();
      res.status(200).json({ success: true, message: 'Story bookmarked successfully', data: story });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to bookmark story', data: error.message });
    }
  };



// Function to get stories bookmarked by a particular user
const userBookmarkedStories = async (req, res) => {
  try {
    let { userId }=req.params
    const bookmarkedStories = await Story.find({ bookmarks: { $in: [userId] } }).populate('userId', 'username');
    res.status(200).json({ success: true, data: bookmarkedStories });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bookmarked stories', data: error.message });
  }
};

// Dislike a story
const dislikeStory = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user; // Extract user ID from authd user

  try {
    let story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    const index = story.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ success: false, error: 'You have not liked this story yet' });
    }
    story.likes.splice(index, 1);
    await story.save();
    res.status(200).json({ success: true, message: 'Story disliked successfully', data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to dislike story', data: error.message });
  }
};

// Remove bookmark from a story
const removeBookmark = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user; // Extract user ID from authd user

  try {
    let story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ success: false, error: 'Story not found' });
    }
    const index = story.bookmarks.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ success: false, error: 'You have not bookmarked this story yet' });
    }
    story.bookmarks.splice(index, 1);
    await story.save();
    res.status(200).json({ success: true, message: 'Bookmark removed successfully', data: story });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to remove bookmark', data: error.message });
  }
};


module.exports = {
    makeStory,
    viewStory ,
    editStory,
    likeStory ,
    bookmarkStory,
    getAll,
    userBookmarkedStories,
    dislikeStory,
    removeBookmark
}