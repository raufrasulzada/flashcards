import React, { useState, useEffect, useRef } from "react";

export default function FlashCards({ flashCard, onDelete, onEdit }) {
  const [turn, setTurn] = useState(false);
  const [height, setHeight] = useState("initial");
  const [status, setStatus] = useState(flashCard.status || "Want to Learn");
  const [editMode, setEditMode] = useState(false);
  const [editedFront, setEditedFront] = useState(flashCard.front);
  const [editedBack, setEditedBack] = useState(flashCard.back);
  const [markedAsLearned, setMarkedAsLearned] = useState(
    flashCard.status === "Learned"
  );
  const [buttonText, setButtonText] = useState(
    markedAsLearned ? "Mark as Learned" : "Mark as Noted"
  );

  const frontEl = useRef();
  const backEl = useRef();

  const handleClick = () => {
    if (!editMode) {
      setTurn(!turn);
    }
  };

  const handleMouseEnter = () => {
    setHeight("auto");
  };

  const handleMouseLeave = () => {
    setHeight("initial");
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(flashCard.id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const handleUpdateClick = (e) => {
    e.stopPropagation();
    setEditMode(false);
    setTurn(!turn);
    onEdit(flashCard.id, editedFront, editedBack);
  };

  const handleMarkAsNoted = (e) => {
    e.stopPropagation();
    if (!markedAsLearned && status === "Want to Learn") {
      setStatus("Noted");
      setButtonText("Mark as Learned");
      setMarkedAsLearned(true);
    } else if (status === "Noted") {
      setStatus("Learned");
    }
  };

  const setMaxHeight = () => {
    if (frontEl.current && backEl.current) {
      const heightFront = frontEl.current.getBoundingClientRect().height;
      const heightBack = backEl.current.getBoundingClientRect().height;
      setHeight(Math.max(heightFront, heightBack, 125));
    }
  };

  useEffect(setMaxHeight, [editedFront, editedBack]);
  useEffect(() => {
    window.addEventListener("resize", setMaxHeight);
    return () => window.removeEventListener("resize", setMaxHeight);
  }, []);

  return (
    <div
      key={flashCard.id}
      className={`card ${turn ? "turn" : ""} ${editMode ? "edit-mode" : ""}`}
      style={{ height: height }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {editMode ? (
        <>
          <input
            type="text"
            value={editedFront}
            onChange={(e) => setEditedFront(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <input
            type="text"
            value={editedBack}
            onChange={(e) => setEditedBack(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={handleUpdateClick}>Update</button>
        </>
      ) : (
        <>
          <div className="front" ref={frontEl}>
            {editedFront}
          </div>
          <div className="back" ref={backEl}>
            <div className={`answer ${turn ? "flipped" : ""}`}>
              {editedBack}
            </div>
            {turn && (
              <button className="noted-button" onClick={handleMarkAsNoted}>
                {buttonText}
              </button>
            )}
          </div>
          {height === "auto" && (
            <div className="card-actions">
              <button onClick={handleDeleteClick}>Delete</button>
              <button onClick={handleEditClick}>Edit</button>
            </div>
          )}
          <div className={`status-corner ${turn ? "flipped" : ""}`}>
            {status}
          </div>
        </>
      )}
    </div>
  );
}
