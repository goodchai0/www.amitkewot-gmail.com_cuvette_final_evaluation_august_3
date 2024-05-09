import React, { useState } from "react";
import styles from "./Navbar.module.css";
import LoginModal from "../Login/Login.jsx";
import RegisterModal from "../Register/Register.jsx";
import AddStoryModal from "../AddStory/AddStory.jsx";
import { useAuth } from "../../context/authContext.jsx";
import profile from "../../assets/images/profile.svg";
import hamburg from "../../assets/images/hamburg.svg";
import bm from "../../assets/images/bm.svg";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setRefreshStories, setCategoryOnNavBar }) => {
  const { loggedIn, logout, username } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [showUserMenuM, setShowUserMenuM] = useState(false);

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
    setShowUserMenuM(!showUserMenuM);
  };

  const handleLoginClick = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
    setShowUserMenuM(!showUserMenuM);
  };
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleUserMenuM = () => {
    setShowUserMenuM(!showUserMenuM);
  };
  const handleLogout = () => {
    // Add logout functionality here
    setShowUserMenuM(!showUserMenuM);
    setCategoryOnNavBar("All");
    setShowUserMenu(false);
    logout();
    console.log("Logout clicked");
    navigate("/");
  };
  const handleAddStoryClick = () => {
    setShowAddStoryModal(true);
    setShowUserMenuM(!showUserMenuM);
  };
  const handleCategory = () => {
    navigate("/");
    setCategoryOnNavBar((prev) => !prev);
    setShowUserMenuM(!showUserMenuM);

    console.log("user");
  };
  return (
    <div className={styles.navbar}>
      <div
        className={styles.logo}
        onClick={() => {
          navigate("/");
        }}
      >
        <p>SwipTory</p>
      </div>

      <div className={styles.user}>
        {loggedIn ? (
          <>
            <button
              className={styles.bookmark}
              onClick={() => {
                navigate("/bookmarks");
              }}
            >
              <img src={bm} alt="" />
              Bookmarks
            </button>
            <button className={styles.addStory} onClick={handleAddStoryClick}>
              Add story
            </button>
            <img className={styles.profile} src={profile} alt="profile" />
            <img
              className={styles.hamburg}
              src={hamburg}
              alt="hamburger"
              onClick={toggleUserMenu}
            />
            {showUserMenu && (
              <div className={styles.userMenu}>
                <p>{username}</p>
                <button onClick={handleLogout} className={styles.logout}>
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button className={styles.register} onClick={handleRegisterClick}>
              Register Now
            </button>
            <button className={styles.login} onClick={handleLoginClick}>
              Sign In
            </button>
          </>
        )}

        <img
          className={styles.hamburg_mobile_view}
          src={hamburg}
          alt="hamburger"
          onClick={toggleUserMenuM}
        />
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
      {showAddStoryModal && (
        <AddStoryModal
          onClose={() => setShowAddStoryModal(false)}
          setRefreshStories={setRefreshStories}
        />
      )}

      {!loggedIn && showUserMenuM && (
        <div className={styles.menu_not_logged}>
          <h1 className={styles.cross} onClick={toggleUserMenuM}>
            X
          </h1>
          <button className={styles.register_m} onClick={handleRegisterClick}>
            Register Now
          </button>
          <button className={styles.login_m} onClick={handleLoginClick}>
            Sign In
          </button>
        </div>
      )}

      {loggedIn && showUserMenuM && (
        <div className={styles.menu_not_logged}>
          <h1 className={styles.cross} onClick={toggleUserMenuM}>
            X
          </h1>
          <div style={{ display: "flex" }}>
            <img className={styles.profile_m} src={profile} alt="profile" />
            <h3 style={{ marginRight: "7rem" }}>{username}</h3>
          </div>
          <button className={styles.addStory_m} onClick={handleCategory}>
            Your story
          </button>

          <button
            className={styles.bookmark_m}
            onClick={() => {
              navigate("/bookmarks");
            }}
          >
            <img style={{ paddingRight: "0.5rem" }} src={bm} alt="" />
            Bookmarks
          </button>
          <button className={styles.addStory_m} onClick={handleAddStoryClick}>
            Add story
          </button>
          <button onClick={handleLogout} className={styles.logout_m}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
