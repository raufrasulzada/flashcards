import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import FlashCards from "./FlashCards";
import FlashCardsList from "./FlashCardsList";

import "./style/App.css";

function App() {
  const [flashCards, setFlashCards] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/db.json`)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlashCards = data.flashCards.map((question) => {
          const correctAnswer = question.back;
          return {
            id: question.id,
            front: question.front,
            back: question.back,
          };
        });
        setFlashCards(updatedFlashCards);
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
      });
  }, []);

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
          </ul>
        </nav>

        <Routes>
          <Route path="/flashcards" element={<Home />} />
          <Route
            path="/flashcardspage"
            element={
              <div className="container">
                <FlashCardsList flashCards={flashCards} />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
