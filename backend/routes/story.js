const express = require("express");
const {
  makeStory,
  viewStory,
  editStory,
  likeStory,
  bookmarkStory,
  getAll,
  userBookmarkedStories,
  removeBookmark,
  dislikeStory,
} = require("../controllers/story.js");
const { auth } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Create a new story (requires authentication)
router.post("/create", auth, makeStory);

// Get all stories
router.get("/", getAll);

// View a specific story
router.get("/:storyId", auth, viewStory);

// Get bookmarked stories by user
router.get("/bookmarked/:userId", auth, userBookmarkedStories);

// Edit a story (requires authentication)
router.put("/:storyId/edit", auth, editStory);

// Like a story (requires authentication)
router.post("/:id/like", auth, likeStory);

// Bookmark a story (requires authentication)
router.post("/:id/bookmark", auth, bookmarkStory);

// Like a story (requires authentication)
router.post("/:id/dislike", auth, dislikeStory);

// Bookmark a story (requires authentication)
router.post("/:id/unbookmark", auth, removeBookmark);

module.exports = router;
