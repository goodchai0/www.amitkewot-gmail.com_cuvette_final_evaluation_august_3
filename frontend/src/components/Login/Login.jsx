import React, { useState, useEffect, useRef } from "react";
import styles from "./Login.module.css";
import { useAuth } from "../../context/authContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onClose }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef(null); 
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      if (response.data.success) {
        onClose();
        toast.success("Login Successful", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorMessage = response.data.error || "Login failed";
        setErrorMessage(errorMessage);
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent} ref={modalRef}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2>Login to SwipTory</h2>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}{" "}
       <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;