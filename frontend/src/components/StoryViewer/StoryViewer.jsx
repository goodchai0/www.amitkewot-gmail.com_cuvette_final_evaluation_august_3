import React, { useState, useEffect } from "react";
import styles from "./StoryViewer.module.css";
import right from "../../assets/images/right.svg";
import left from "../../assets/images/left.svg";
import cancel from "../../assets/images/cancel.svg";
import share from "../../assets/images/share.svg";
import bookmark from "../../assets/images/bookmark1.svg";
import like from "../../assets/images/heart.svg";
import liked from "../../assets/images/liked.svg";
import bookmarked from "../../assets/images/bookmarked.svg";
import { useAuth } from "../../context/authContext.jsx";
import LoginModal from "../Login/Login.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  likeStory,
  bookmarkById,
  viewById,
  dislikeStory,
  unbookmarkById,
} from "../../apis/storyApis.js";

const StoryViewer = ({ story, onClose, setRefresh }) => {
  const { loggedIn } = useAuth();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [likedStory, setLikedStory] = useState(false);
  const [bookmarkedStory, setBookmarkedStory] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [likeCount, setLikeCount] = useState(story.likes.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex(
        (prevIndex) => (prevIndex + 1) % story.slides.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [story.slides.length]);

  useEffect(() => {
    // Check if the story is liked and bookmarked when the component mounts
    // Parse the token to extract user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setUserId(decodedToken.userId);
    }

    if (loggedIn) {
      // Fetch the story details
      viewById(story._id)
        .then((storyData) => {
          if (storyData.bookmarked) {
            setBookmarkedStory(true); // If the story is bookmarked, set bookmarkedStory to true
          }
        })
        .catch((error) => {
          console.error("Failed to fetch story details:", error.message);
        });
    }
  }, [loggedIn, story._id]);

  useEffect(() => {
    if (loggedIn && userId) {
      const checkLikedStory = async () => {
        try {
          const userLiked = story.likes.includes(userId);
          setLikedStory(userLiked);
        } catch (error) {
          console.error("Error checking liked story:", error.message);
        }
      };

      const checkBookmarkedStory = async () => {
        try {
          const userBookmarked = story.bookmarks.includes(userId);
          setBookmarkedStory(userBookmarked);
        } catch (error) {
          console.error("Error checking bookmarked story:", error.message);
        }
      };

      checkLikedStory();
      checkBookmarkedStory();
    }
  }, [loggedIn, userId, story.likes, story.bookmarks]);

  const decodeToken = (token) => {
    try {
      console.log("hi:",JSON.parse(atob(token.split(".")[1])));
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      throw new Error("Invalid token");
    }
  };

  const handlePreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? story.slides.length - 1 : prevIndex - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % story.slides.length);
  };

  const handleLike = async () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }
  
    try {
      if (likedStory) {
        // Dislike the story if it's already liked
        await dislikeStory(story._id);
        setLikedStory(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        // Like the story if it's not liked
        await likeStory(story._id);
        setLikedStory(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
      setRefresh((prev) => !prev); // Toggle refresh state
    } catch (error) {
      console.error("Failed to like story:", error.message);
    }
  };
  
  const handleBookmark = async () => {
    if (!loggedIn) {
      setShowLoginModal(true);
      return;
    }
  
    try {
      if (bookmarkedStory) {
        // Remove bookmark if already bookmarked
        await unbookmarkById(story._id);
        setBookmarkedStory(false);
      } else {
        // Bookmark the story if not bookmarked
        await bookmarkById(story._id);
        setBookmarkedStory(true);
      }
      setRefresh((prev) => !prev); // Toggle refresh state
    } catch (error) {
      console.error("Failed to bookmark story:", error.message);
    }
  };
  const handleShare = () => {
    // Get the parent URL
    const parentUrl = window.location.origin;
    // Copy the URL to the clipboard
    navigator.clipboard
      .writeText(`${parentUrl}/${story._id}`)
      .then(() =>
        toast.success("Link Copied", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      )
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const progressBarWidth =
    (currentSlideIndex + 1) * (100 / story.slides.length);

  return (
    <>
      {showLoginModal ? (
        <LoginModal onClose={handleLoginModalClose} />
      ) : (
        <div className={styles.storyViewer}>
          <div className={styles.overlay} onClick={onClose}></div>
          <div className={styles.previous} onClick={handlePreviousSlide}>
            <img src={left} alt="" />
          </div>

          <div
            className={styles.storyContent}
            style={{
              backgroundImage: `url(${story.slides[currentSlideIndex].imageUrl})`,
            }}
          >
            <div className={styles.progressBar}>
              <div
                className={styles.progressIndicator}
                style={{ width: `${progressBarWidth}%` }}
              ></div>
            </div>
            <div className={styles.gradientOverlay}></div>

            <div className={styles.topActions}>
              <img src={cancel} alt="Cancel" onClick={onClose} />
              <img src={share} alt="Share" onClick={handleShare} />
            </div>

            <div className={styles.slideContent}>
              <h2>{story.slides[currentSlideIndex].heading}</h2>
              <p>{story.slides[currentSlideIndex].description}</p>
            </div>

            <div className={styles.bottomActions}>
              <img
                src={bookmarkedStory ? bookmarked : bookmark}
                alt="Bookmark"
                onClick={handleBookmark}
              />
              <div style={{ display: "flex" }}>
                <img
                  src={likedStory ? liked : like}
                  alt="Like"
                  onClick={handleLike}
                />
                <h4 style={{ color: "white", marginLeft: "5px" }}>
                  {likeCount}
                </h4>
              </div>
            </div>
          </div>
          <div className={styles.next} onClick={handleNextSlide}>
            <img src={right} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default StoryViewer;
