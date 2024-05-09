import axios from 'axios';
// const backendUrl = "https://goodchai0-www-amitkewot-gmail-com-fjjp.onrender.com";
const backendUrl = "http://localhost:4000";

// Function to create a new story
export const makeStory = async (slides) => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.post(`${backendUrl}/api/stories/create`, { slides }, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to create story:', error.response.data.error);
    throw new Error('Failed to create story');
  }
};

// Function to get all stories
export const getAll = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/stories`);
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to get all stories:', error.response.data.error);
    throw new Error('Failed to get all stories');
  }
};


// Function to view a specific story by ID
export const viewById = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${backendUrl}/api/stories/${storyId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log("hi<",response.data)
    return response.data;
  } catch (error) {
    console.error('Failed to view story:', error.response.data.error);
    throw new Error('Failed to view story');
  }
}

// Function to edit a story by ID
export const editById = async (storyId, slides) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${backendUrl}/api/stories/${storyId}/edit`, { slides }, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to edit story:', error.response.data.error);
    throw new Error('Failed to edit story');
  }
};

// Function to like a story by ID
export const likeStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${backendUrl}/api/stories/${storyId}/like`, null, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to like story:', error.response.data.error);
    throw new Error('Failed to like story');
  }
};

// Function to dislike a story by ID
export const dislikeStory = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${backendUrl}/api/stories/${storyId}/dislike`, null, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to like story:', error.response.data.error);
    throw new Error('Failed to like story');
  }
};

// Function to bookmark a story by ID
export const bookmarkById = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${backendUrl}/api/stories/${storyId}/bookmark`, null, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to bookmark story:', error.response.data.error);
    throw new Error('Failed to bookmark story');
  }
};

// Function to bookmark a story by ID
export const unbookmarkById = async (storyId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${backendUrl}/api/stories/${storyId}/unbookmark`, null, {
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Failed to bookmark story:', error.response.data.error);
    throw new Error('Failed to bookmark story');
  }
};

// Function to get stories bookmarked by a particular user
export const userBookmarkedStories = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    console.log(token)
    const response = await axios.get(`${backendUrl}/api/stories/bookmarked/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}` // Include JWT token in the request headers
      }});
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bookmarked stories:', error.response.data.error);
    throw new Error('Failed to fetch bookmarked stories');
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${backendUrl}/api/users/login`, {
      username,
      password,
    });
    console.log(response);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("LoggedIn",true);
      localStorage.setItem("UserName",response.data.username);
      localStorage.setItem("User",response.data.user); // Set the user in state
    } else {
      console.error(response.data.error);
    }

    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${backendUrl}/api/users/register`, {
      username,
      password,
    });
    console.log(response);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("LoggedIn",true);
      localStorage.setItem("UserName",response.data.username);
      localStorage.setItem("User",response.data.user); // Set the user in state
    } else {
      console.error(response.data.error);
    }

    return response;
  } catch (error) {
    console.error("Registration failed:", error.message);
  }
};