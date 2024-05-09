import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { userBookmarkedStories } from "../../apis/storyApis";
import Card from "../../components/Card/Card"; // Import the Card component
import styles from "./BookMarks.module.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const BookMarks = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [categoryOnNavBar, setCategoryOnNavBar] = useState(false);
  const [refresh, setRefresh] = useState(true); // State to track loading status

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      const userId = decodedToken.userId;
      userBookmarkedStories(userId)
        .then((response) => {
          setBookmarkedStories(response.data); 
          setLoading(false); 
        })
        .catch((error) => {
          console.error(
            "Failed to fetch bookmarked stories:",
            error.response.data.error
          );
          setLoading(false); 
        });
    }
  }, [refresh, categoryOnNavBar]);

  const decodeToken = (token) => {
    try {
      console.log(JSON.parse(atob(token.split(".")[1])));
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      throw new Error("Invalid token");
    }
  };
  useEffect(() => {
    // navigate("/")
  }, [ categoryOnNavBar]);
  return (
    <div>
      <Navbar setCategoryOnNavBar={setCategoryOnNavBar}      />
      <h2 className={styles.title}>Your Bookmarks</h2>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div className={styles.storiesContainer}>
            {" "}
            {/* Wrap the story cards in a container */}
            {bookmarkedStories.length === 0 ? (
              <div className={styles.noBookmarks}>
                <p>You have no Bookmarks</p>
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              bookmarkedStories.map((story) => (
                <div key={story._id} className={styles.storyBoard}>
                  {" "}
                  <Card story={story}  setRefresh={setRefresh} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookMarks;
