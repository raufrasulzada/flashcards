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
              <Link to="/raufrasulzada.github.io/flash-cards">Home</Link>
            </li>
            <li>
              <Link to="/raufrasulzada.github.io/flashcards-page">
                Flash Cards
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/raufrasulzada.github.io/flash-cards"
            element={<Home />}
          />
          <Route
            path="/raufrasulzada.github.io/flashcards-page"
            element={<FlashCards />}
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
