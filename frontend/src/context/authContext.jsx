import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://goodchai0-www-amitkewot-gmail-com-fjjp.onrender.com";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUserName] = useState("User");
  const [user, setUser] = useState(null); // Include user state

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/login`, {
        username,
        password,
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setLoggedIn(true);
        setUserName(response.data.username);
        setUser(response.data.user); // Set the user in state
      } else {
        console.error(response.data.error);
      }

      return response;
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/users/register`, {
        username,
        password,
      });
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setLoggedIn(true);
        setUserName(response.data.username);
        setUser(response.data.user); // Set the user in state
      } else {
        console.error(response.data.error);
      }

      return response;
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null); // Clear the user from state
  };

  return (
    <AuthContext.Provider
      value={{ user, loggedIn, username, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};