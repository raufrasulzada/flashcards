import React, { useState } from "react";

export default function FlashCards({ flashCard }) {
  const [turn, setTurn] = useState(false);
  return (
    <div
      key={flashCard.id}
      className={`card ${turn ? "turn" : ""}`}
      onClick={() => setTurn(!turn)}
    >
      <div className="front">
        {flashCard.front}
        <div className="flash-card-options">
          {flashCard.options.map((option, index) => {
            return (
              <div key={index} className="flash-card-option">
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className="back">{flashCard.back}</div>
    </div>
  );
}
