import React, { useState, useEffect, useRef } from "react";
import styles from "./AddStory.module.css"; 
import { makeStory, editById } from "../../apis/storyApis.js"; 
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const AddStory = ({ onClose, story, setRefreshStories }) => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slides, setSlides] = useState([
    { heading: "", description: "", imageUrl: "", category: "" },
    { heading: "", description: "", imageUrl: "", category: "" },
    { heading: "", description: "", imageUrl: "", category: "" },
  ]);
  const modalRef = useRef(null);
  useEffect(() => {
    if (story) {
      setSlides(story.slides);
    }
  }, [story]);

  const handleInputChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const handleAddSlide = () => {
    if (slides.length < 6) {
      const newSlide = {
        heading: "",
        description: "",
        imageUrl: "",
        category: "",
      };
      setSlides([...slides, newSlide]);
      setCurrentSlide(slides.length + 1);
    }
  };

  const handlePreviousSlide = () => {
    setCurrentSlide(Math.max(currentSlide - 1, 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(Math.min(currentSlide + 1, slides.length));
  };

  const handleSlideClick = (slideIndex) => {
    setCurrentSlide(slideIndex + 1);
  };

  const handleCancelSlide = (index) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1); // Remove the slide at the specified index
    setSlides(newSlides);
    // Adjust the current slide if necessary
    if (currentSlide > newSlides.length) {
      setCurrentSlide(newSlides.length);
    }
  };

  useEffect(() => {
    // Function to close the modal when clicking outside of it
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    // Add event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async () => {
    try {
      if (story) {
        // If story exists, it means we are editing it
        await editById(story._id, slides);
        onClose();
        toast.success("Story Updated", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Otherwise, we are creating a new story
        await makeStory(slides);
        setSlides([
          { heading: "", description: "", imageUrl: "", category: "" },
          { heading: "", description: "", imageUrl: "", category: "" },
          { heading: "", description: "", imageUrl: "", category: "" },
        ]);
        setCurrentSlide(1);
        onClose();
        setRefreshStories((prev) => !prev); // Toggle refresh state
        toast.success("Story Created", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Failed to save story:", error.message);
      toast.error("Failed to save story", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={styles.modal}>
      {/* Modal content */}
      <div className={styles.modalContent} ref={modalRef}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        {/* Iterate over slides */}
        <div className={styles.slidesNumbers}>
          {[...Array(slides.length).keys()].map((slideIndex) => (
            <div
              key={slideIndex}
              className={`${styles.slide} ${
                currentSlide === slideIndex + 1 ? styles.activeSlide : ""
              }`}
              onClick={() => handleSlideClick(slideIndex)}
            >
              Slide {slideIndex + 1}
              {slideIndex > 2 && (
                <span
                  className={styles.cancelSlide}
                  onClick={() => handleCancelSlide(slideIndex)}
                >
                  &times;
                </span>
              )}
            </div>
          ))}
          {slides.length < 6 && (
            <div
              className={styles.slide}
              onClick={handleAddSlide}
              disabled={slides.length >= 6}
            >
              Add +
            </div>
          )}
        </div>
        {/* Slide content */}
        <div className={styles.slideinputs}>
          <div className={styles.slideContent}>
            {/* Content for the current slide */}
            <div>
              <label>Heading:</label>
              <input
                type="text"
                className={styles.inputbox}
                value={slides[currentSlide - 1]?.heading}
                placeholder="Your heading"
                onChange={(e) =>
                  handleInputChange(currentSlide - 1, "heading", e.target.value)
                }
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                className={styles.description}
                value={slides[currentSlide - 1]?.description}
                placeholder="Story Description"
                onChange={(e) =>
                  handleInputChange(
                    currentSlide - 1,
                    "description",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Image:</label>
              <input
                type="text"
                className={styles.inputbox}
                value={slides[currentSlide - 1]?.imageUrl}
                placeholder="Add Image url"
                onChange={(e) =>
                  handleInputChange(
                    currentSlide - 1,
                    "imageUrl",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label>Category:</label>
              <select
                value={slides[currentSlide - 1]?.category}
                className={styles.inputbox}
                placeholder="Select category"
                onChange={(e) =>
                  handleInputChange(
                    currentSlide - 1,
                    "category",
                    e.target.value
                  )
                }
              >
                <option>Select category</option>
                <option value="Food">Food</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Travel">Travel</option>
                <option value="Movie">Movies</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
          <div className={styles.navigation}>
            <div>
              <button
                className={styles.previous}
                onClick={handlePreviousSlide}
                disabled={currentSlide === 1}
              >
                Previous
              </button>
              <button
                className={styles.next}
                onClick={handleNextSlide}
                disabled={currentSlide === slides.length}
              >
                Next
              </button>
            </div>
            <button className={styles.post} onClick={handleSubmit}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStory;
