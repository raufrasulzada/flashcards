import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import FlashCardsList from "./FlashCardsList";
import Contact from "./Contact";

import "./style/App.css";

function App() {
  const [flashCards, setFlashCards] = useState([]);

  const handleDelete = (id) => {
    const updatedFlashCards = flashCards.filter((card) => card.id !== id);
    setFlashCards(updatedFlashCards);

    fetch(`http://localhost:3000/flashCards/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to delete card from server");
        }
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  };

  function fetchFlashCards(setFlashCards) {
    fetch(`${process.env.PUBLIC_URL}/data/db.json`)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlashCards = data.flashCards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
          status: card.status || "Want to Learn",
          lastModified: card.lastModified || "unknown",
          order: card.order,
        }));
        setFlashCards(updatedFlashCards);
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error);
      });
  }

  useEffect(() => {
    const logs = localStorage.getItem("logs");
    if (logs) {
      console.log("Logs retrieved:", JSON.parse(logs));
    }

    fetchFlashCards(setFlashCards);
  }, []);

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(flashCards));
  }, [flashCards]);

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
          <Route
            path="/flashcardspage"
            element={
              <div className="container">
                <FlashCardsList
                  flashCards={flashCards}
                  onDelete={handleDelete}
                  setFlashCards={setFlashCards}
                />
              </div>
            }
          />
          <Route path="/flashcards" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
