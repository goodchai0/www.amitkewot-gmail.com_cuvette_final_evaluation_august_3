import React, { useEffect, useState } from "react";
import StoryCard from "../Card/Card";
import styles from "./Stories.module.css";
import { useAuth } from "../../context/authContext";

const Stories = ({
  stories,
  selectedCategory,
  setRefresh,
  open_story,
  categoryOnNavBar,
}) => {
  const [categoryShowAll, setCategoryShowAll] = useState({});
  const [userShowAll, setUserShowAll] = useState(false);

  // List of all categories
  const categories = [
    "Food",
    "Health & Fitness",
    "Travel",
    "Movie",
    "Education",
  ];
  const { user } = useAuth();

  
  if (user) {
    categories.splice(0, 0, "User");
  }


  const groupedStories = stories.reduce((acc, story) => {
    const category = story.slides[0].category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(story);
    return acc;
  }, {});

  useEffect(() => {
    setCategoryShowAll({});
    setUserShowAll(false);
  }, [selectedCategory, categoryOnNavBar]);

  const renderStories = (category) => {
    if (category === "User") {
      // Filter stories where the user ID matches the logged-in user's ID
      const userStories = stories.filter(
        (story) => story.userId._id === user?._id
      );
      const userStoriesToRender = userShowAll
        ? userStories
        : userStories.slice(0, open_story ? userStories.length : 4);
  
      return (
        <div key={category}>
          <h2 className={styles.heading}>{`Your Stories`}</h2>
          <div className={styles.storiesContainer}>
            {userStoriesToRender.length > 0 ? (
              <>
                <div className={styles.storyBoard}>
                  {userStoriesToRender.map((story) => (
                    <StoryCard
                      key={story._id}
                      story={story}
                      setRefresh={setRefresh}
                      open_story={open_story}
                    />
                  ))}
                </div>
                {!userShowAll && userStories.length > 4 && (
                  <button
                    className={styles.showMoreBotton}
                    onClick={() => setUserShowAll(true)}
                  >
                    See More
                  </button>
                )}
              </>
            ) : (
              <h2 className={styles.NotPresent}>No stories in this category</h2>
            )}
          </div>
        </div>
      );
    } else {
      const storiesForCategory = groupedStories[category] || [];
      const showAll = categoryShowAll[category] || false;
      const storiesToRender = showAll
        ? storiesForCategory
        : storiesForCategory.slice(0, open_story ? storiesForCategory.length : 4);
  
      return (
        <div key={category}>
          <h2 className={styles.heading}>{`Top Stories About ${category}`}</h2>
          <div className={styles.storiesContainer}>
            {storiesToRender.length > 0 ? (
              <>
                <div className={styles.storyBoard}>
                  {storiesToRender.map((story) => (
                    <StoryCard
                      key={story._id}
                      story={story}
                      setRefresh={setRefresh}
                      open_story={open_story}
                    />
                  ))}
                </div>
                {!showAll && storiesForCategory.length > 4 && (
                  <button
                    className={styles.showMoreBotton}
                    onClick={() =>
                      setCategoryShowAll((prevState) => ({
                        ...prevState,
                        [category]: true,
                      }))
                    }
                  >
                    See More
                  </button>
                )}
              </>
            ) : (
              <h2 className={styles.NotPresent}>No stories in this category</h2>
            )}
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {selectedCategory === "All" ? (
        <>
          {categories.map((category) => (
            <React.Fragment key={category}>
              {renderStories(category)}
            </React.Fragment>
          ))}
        </>
      ) : (
        <div>{renderStories(selectedCategory)}</div>
      )}
    </>
  );
};

export default Stories;
