import React, { useEffect, useState } from "react";
import styles from "./Card.module.css";
import StoryViewer from "../StoryViewer/StoryViewer.jsx"; 
import AddStory from "../AddStory/AddStory.jsx"; 
import edit from "../../assets/images/tabler_edit.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";

const Card = ({ story, setRefresh, open_story }) => {
  const { user } = useAuth();
  const [isViewerOpen, setIsViewerOpen] = useState(open_story == story._id);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const navigate=useNavigate()
  const handleCardClick = () => {
    setIsViewerOpen(true);
  };

  const handleEditClick = () => {
    setIsViewerOpen(false); 
    setIsEditMode(true);
  };

  const {id}=useParams()
  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setCurrentSlideIndex(0); 
    console.log("close")
    if(id){
      navigate("/")
    }
  };

  const handleCloseEdit = () => {
    setIsViewerOpen(false);
    setIsEditMode(false);
  };



  return (
    <>
      <div
        className={styles.storyCard}
        onClick={handleCardClick}
        style={{
          backgroundImage: `url(${story.slides[currentSlideIndex].imageUrl})`,
        }}
      >
        <div className={styles.gradientOverlay}></div>
        <div className={styles.bottomContent}>
          <h2>{story.slides[currentSlideIndex].heading}</h2>
          <p>{story.slides[currentSlideIndex].description}</p>
        </div>

        <div className={styles.editButtonContainer} onClick={handleEditClick}>
          {user && user._id === story.userId._id && (
            <button className={styles.editButton}>
              <img src={edit} alt="" />
              Edit
            </button>
          )}
        </div>
      </div>
      {isViewerOpen && !isEditMode && (
        <StoryViewer
          story={story}
          onClose={handleCloseViewer}
          setRefresh={setRefresh}
        />
      )}
      {isEditMode && <AddStory story={story} onClose={handleCloseEdit} />}
    </>
  );
};

export default Card;
