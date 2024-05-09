import React, { useState, useEffect, useRef } from "react";
import styles from "./Register.module.css";
import { useAuth } from "../../context/authContext.jsx"; // Import useAuth hook
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css";

const Register = ({ onClose }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const modalRef = useRef(null); 

  useEffect(() => {
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

  const handleRegister = async () => {
    try {
      const response = await register(username, password);
      console.log(response);
      if (response.data.success) {
        onClose();
        toast.success("Registration Successful", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      toast.error("Registration failed");
    }
  };

  return (
    <div className={styles.modal}>
      <div ref={modalRef} className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <h2>Register to SwipTory</h2>
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
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Register;