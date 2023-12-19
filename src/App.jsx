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

  const handleAddCard = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsAddingCard(true);

    const maxId = flashCards.reduce(
      (max, card) => (card.id > max ? card.id : max),
      0
    );
    const newCard = {
      id: maxId + 1,
      front: "",
      back: "",
      lastModified: "",
      status: "Want to Learn",
    };

    try {
      const response = await fetch("http://localhost:3000/flashCards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCard),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Card added successfully:", data);

        setFlashCards((prevCards) => [...prevCards, data]);

        setEditingCardId(data.id);
        setCreateCardModalOpen(true);
        handleAddCardComplete();
      } else {
        console.error("Failed to add card to server");
      }
    } catch (error) {
      console.error("Error adding card:", error);
    }
  };

  const handleAddCardComplete = () => {
    setIsAddingCard(false);
  };

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/db.json`)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlashCards = data.flashCards.map((card) => ({
          id: card.id,
          front: card.front,
          back: card.back,
          status: card.status || "Want to Learn",
          lastModified: card.lastModified || "unknown",
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
                  type="button"
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
