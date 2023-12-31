import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import FlashFetch from "./FlashFetch";
import Home from "./Home";
import Contact from "./Contact";

import "./style/App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link className="btn" to="/flashcards">
                Home
              </Link>
            </li>
            <li>
              <Link className="btn" to="/flashcardspage">
                Flash Cards
              </Link>
            </li>
            <li>
              <Link className="btn" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/flashcardspage" element={<FlashFetch />} />
          <Route path="/flashcards" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
