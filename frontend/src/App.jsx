import React from "react";
import {
  Route,
  Routes
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookMarks from "./pages/BookMarks/BookMarks";

function App() {
  return (
  <>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/:id" element={<HomePage/>}/>
      <Route path="/bookmarks" element={<BookMarks/>}/>
    </Routes>
  </>
  )
}

export default App;

