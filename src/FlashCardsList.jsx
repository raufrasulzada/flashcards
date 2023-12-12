import React from "react";
import FlashCards from "./FlashCards";

export default function FlashCardsList({ flashCards }) {
  return (
    <div className="card-container">
      {flashCards.map((flashCard) => {
        return <FlashCards flashCard={flashCard} key={flashCard.id} />;
      })}
    </div>
  );
}
