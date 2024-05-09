import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Filter from "../components/Filters/Filter";
import Stories from "../components/Stories/Stories";
import { getAll } from "../apis/storyApis";
import Loading from "../components/Loading/Loading";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";

const HomePage = () => {
  const [stories, setStories] = useState([]); // State to store all stories
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // State to track loading status
  const [refresh, setRefresh] = useState(true); // State to track loading status
  const [refreshStories, setRefreshStories] = useState(true); // State to track loading status
  const [categoryOnNavBar, setCategoryOnNavBar] = useState(false);
  const { loggedIn } = useAuth();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    console.log(category);
  };

  const fetchAllStories = async () => {
    try {
      const response = await getAll();
      console.log(response);
      setStories(response.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Failed to get all stories:", error.response.data.error);
      throw new Error("Failed to get all stories");
    }
  };

  let { id } = useParams();
  let open_story = id;
  console.log({ home: open_story });
  useEffect(() => {
    fetchAllStories(); // Fetch stories on component mount
  }, [refresh, refreshStories, categoryOnNavBar]);
  useEffect(() => {
    if (loggedIn) {
      setSelectedCategory("User"); // Fetch stories on component mount
    } else {
      setSelectedCategory("All");
    }
  }, [categoryOnNavBar]);
  return (
    <div>
      <Navbar
        setRefreshStories={setRefreshStories}
        setCategoryOnNavBar={setCategoryOnNavBar}      />
      <Filter onFilterChange={handleCategoryChange} />
      {/* Display loading spinner if data is still being fetched */}
      {loading ? (
        <Loading />
      ) : (
        <Stories
          stories={stories}
          selectedCategory={selectedCategory}
          setRefresh={setRefresh}
          open_story={open_story}
          categoryOnNavBar={categoryOnNavBar}
        />
      )}
    </div>
  );
};

export default HomePage;
