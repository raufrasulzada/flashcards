import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./Home";
import FlashCardsList from "./FlashCardsList";
import CreateCard from "./CreateCard";
import Contact from "./Contact";

import "./style/App.css";

function App() {
  const [flashCards, setFlashCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);
  const [createCardModalOpen, setCreateCardModalOpen] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const handleDelete = (id) => {
    const updatedFlashCards = flashCards.filter((card) => card.id !== id);
    setFlashCards(updatedFlashCards);
  };

  const handleAddCard = () => {
    if (!editingCardId) {
      const newCard = {
        id: flashCards.length + 1,
        front: "",
        back: "",
      };
      setFlashCards([...flashCards, newCard]);
      setEditingCardId(newCard.id);
      setCreateCardModalOpen(true);
    }
  };

  const handleAddCardComplete = () => {
    setIsAddingCard(false);
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/db.json`)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlashCards = data.flashCards.map((question) => ({
          id: question.id,
          front: question.front,
          back: question.back,
        }));
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
            <li>
              <Link className="btn" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <Routes>
            <Route
              path="/flashcardspage"
              element={
                <button
                  className="btn add-card-button"
                  onClick={handleAddCard}
                  disabled={isAddingCard}
                >
                  Add Card
                </button>
              }
            />
          </Routes>
        </nav>

        <Routes>
          <Route
            path="/flashcardspage"
            element={
              <div className="container">
                <FlashCardsList
                  flashCards={flashCards}
                  onDelete={handleDelete}
                  setEditingCardId={setEditingCardId}
                  setCreateCardModalOpen={setCreateCardModalOpen}
                  onAddCardComplete={handleAddCardComplete}
                />
                {!isAddingCard && (
                  <CreateCard
                    onClose={() => {
                      setCreateCardModalOpen(false);
                      handleAddCardComplete();
                    }}
                    onAddCard={(newCardId, newFront, newBack) => {
                      console.log("Adding card:", newCardId, newFront, newBack);
                      setFlashCards((prevCards) => [
                        ...prevCards,
                        { id: newCardId, front: newFront, back: newBack },
                      ]);
                      setCreateCardModalOpen(false);
                      handleAddCardComplete();
                    }}
                    flashCards={flashCards}
                    setFlashCards={setFlashCards}
                    editingCardId={editingCardId}
                    setEditingCardId={setEditingCardId}
                    createCardModalOpen={createCardModalOpen}
                  />
                )}
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
