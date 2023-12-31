import React, { useState, useEffect } from "react";
import FlashCardsList from "./FlashCardsList";

function FlashFetch() {
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

  function fetchFlashCards() {
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
    fetchFlashCards();
  }, []);

  const handleCardUpdate = (updatedCard) => {
    const cardIndex = flashCards.findIndex(
      (card) => card.id === updatedCard.id
    );

    if (cardIndex !== -1) {
      const updatedFlashCards = [...flashCards];
      updatedFlashCards[cardIndex] = {
        ...updatedCard,
        lastModified: flashCards[cardIndex].lastModified,
      };

      setFlashCards(updatedFlashCards);
    }
  };

  return (
    <div className="container">
      <FlashCardsList
        flashCards={flashCards}
        onDelete={handleDelete}
        setFlashCards={handleCardUpdate}
      />
    </div>
  );
}

export default FlashFetch;
