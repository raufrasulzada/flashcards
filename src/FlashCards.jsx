import React, { useState, useEffect, useRef } from "react";

const handleUpdate = (id, front, back, setFlashCards) => {
  const currentDate = new Date().toISOString().split("T")[0];

  fetch(`http://localhost:3000/flashCards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ front, back, lastModified: currentDate }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to update card on server");
        throw new Error("Failed to update card on server");
      }
      return response.json();
    })
    .then((updatedCard) => {
      setFlashCards((prevCards) =>
        prevCards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        )
      );
    })
    .catch((error) => {
      console.error("Error updating card:", error);
    });
};

export { handleUpdate };

export default function FlashCards({
  flashCard,
  onDelete,
  onEdit,
  onUpdate,
  flashCards,
  setFlashCards,
}) {
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
    if (onUpdate) {
      onUpdate(
        flashCard.id,
        editedFront,
        editedBack,
        flashCards,
        setFlashCards
      );
    }
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

  useEffect(() => {
    setEditedFront(flashCard.front);
    setEditedBack(flashCard.back);
  }, [flashCard]);

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
