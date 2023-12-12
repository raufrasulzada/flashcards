import React, { useState, useEffect, useRef } from "react";

export default function FlashCards({ flashCard, onDelete, onEdit }) {
  const [turn, setTurn] = useState(false);
  const [height, setHeight] = useState("initial");
  const [status, setStatus] = useState(flashCard.status || "Want to Learn");

  const frontEl = useRef();
  const backEl = useRef();

  useEffect(() => {
    console.log(`Status of card ${flashCard.id} changed to: ${status}`);
  }, [status]);

  const handleClick = () => {
    setTurn(!turn);

    if (status !== "Learned") {
      setStatus("Learned");
    }
  };

  const handleMouseEnter = () => {
    setHeight("auto");
  };

  const handleMouseLeave = () => {
    setHeight("initial");
  };

  function setMaxHeight() {
    const heightFront = frontEl.current.getBoundingClientRect().height;
    const heightBack = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(heightFront, heightBack, 100));
  }

  useEffect(setMaxHeight, [flashCard.front, flashCard.back]);
  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <div
      key={flashCard.id}
      className={`card ${turn ? "turn" : ""}`}
      style={{ height: height }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="front" ref={frontEl}>
        {flashCard.front}
      </div>
      <div className="back" ref={backEl}>
        <div className="answer">{flashCard.back}</div>
        {turn && (
          <button
            className="noted-button"
            onClick={(e) => {
              e.stopPropagation();
              setStatus("Noted");
            }}
          >
            Mark as Noted
          </button>
        )}
      </div>
      {height === "auto" && (
        <div className="card-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(flashCard.id);
            }}
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(flashCard.id);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
