import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import FlashCards from "./FlashCards";

import "./style/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/flashcards">Home</Link>
            </li>
            <li>
              <Link to="/flashcardspage">Flash Cards</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/flashcards" element={<Home />} />
          <Route path="/flashcardspage" element={<FlashCards />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
