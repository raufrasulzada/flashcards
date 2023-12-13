import React from "react";
import FlashCards from "./FlashCards";

export default function FlashCardsList({ flashCards, onDelete, onEdit }) {
  return (
    <div className="card-container">
      {flashCards.map((flashCard) => (
        <FlashCards
          key={flashCard.id}
          flashCard={flashCard}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
