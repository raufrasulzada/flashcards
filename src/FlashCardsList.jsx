import React, { useState, useEffect } from "react";
import FlashCards from "./FlashCards";
import AddCardForm from "./AddCardForm";
import { handleUpdate } from "./FlashCards";

function FlashCardsList({ onDelete, setFlashCards: updateFlashCards }) {
  const [flashCards, setLocalFlashCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAttribute, setSortAttribute] = useState("lastModified");
  const [isAddCardFormVisible, setIsAddCardFormVisible] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/flashCards")
      .then((response) => response.json())
      .then((data) => setLocalFlashCards(data))
      .catch((error) => console.error("Error fetching flash cards:", error));
  }, []);

  const handleAddCard = (newCard) => {
    fetch("http://localhost:3000/flashCards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        front: newCard.front,
        back: newCard.back,
        status: "Want to Learn",
        lastModified: new Date().toISOString().split("T")[0],
      }),
    })
      .then((response) => response.json())
      .then((addedCard) => {
        setLocalFlashCards([...flashCards, addedCard]);
        setIsAddCardFormVisible(false);
      })
      .catch((error) => {
        console.error("Error adding card:", error);
      });
  };

  const sortedCards = flashCards
    .filter((card) => {
      const frontText = String(card.front);
      const backText = String(card.back);

      return (
        frontText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((card) => {
      const cardStatus = card.status ? card.status : "unknown";
      return (
        filterStatus === "All" ||
        (cardStatus && cardStatus.toLowerCase() === filterStatus.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortAttribute === "id") {
        return a.id - b.id;
      } else if (sortAttribute === "front") {
        return a.front.localeCompare(b.front);
      } else if (sortAttribute === "back") {
        return a.back.localeCompare(b.back);
      } else if (sortAttribute === "lastModified") {
        return new Date(b.lastModified) - new Date(a.lastModified);
      }
      return 0;
    });
  return (
    <div>
      <div className="card-container">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Want to Learn">Want to Learn</option>
          <option value="Noted">Noted</option>
          <option value="Learned">Learned</option>
        </select>
        <select
          value={sortAttribute}
          onChange={(e) => setSortAttribute(e.target.value)}
        >
          <option value="id">ID</option>
          <option value="front">Front</option>
          <option value="back">Back</option>
          <option value="lastModified">Last Modified</option>
        </select>
        <button
          className="btn add-card-button"
          onClick={() => setIsAddCardFormVisible(true)}
        >
          Add Card
        </button>
      </div>

      {isAddCardFormVisible && (
        <div className="add-card-form-container">
          <AddCardForm
            onAddCard={handleAddCard}
            onCancel={() => setIsAddCardFormVisible(false)}
          />
        </div>
      )}

      <div className="card-container">
        {sortedCards.map((flashCard) => (
          <FlashCards
            key={flashCard.id}
            flashCard={flashCard}
            onDelete={onDelete}
            onUpdate={(front, back) =>
              handleUpdate(flashCard.id, front, back, updateFlashCards)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default FlashCardsList;
