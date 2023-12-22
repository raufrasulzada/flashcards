import React, { useState, useEffect, useRef } from "react";

import "./style/ShareCards.css";

const currentDate = new Date().toISOString().split("T")[0];

const handleUpdate = (id, front, back, setFlashCards) => {
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

const FlashCards = ({
  flashCard,
  onDelete,
  onUpdate,
  flashCards,
  setFlashCards,
  selectedCards,
  setSelectedCards,
}) => {
  const [turn, setTurn] = useState(false);
  const [height, setHeight] = useState("initial");
  const [status, setStatus] = useState(flashCard.status || "Want to Learn");
  const [editMode, setEditMode] = useState(false);
  const [editedFront, setEditedFront] = useState(flashCard.front);
  const [editedBack, setEditedBack] = useState(flashCard.back);

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
    onUpdate(editedFront, editedBack);
    if (selectedCards.includes(flashCard.id)) {
      handleSelectedCardsUpdate(editedFront, editedBack);
    }
  };

  const handleCheckboxClick = (id) => {
    setSelectedCards((prevSelected) => {
      return prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id];
    });
  };

  const handleSelectedCardsUpdate = (front, back) => {
    const updatedCards = flashCards.map((card) =>
      selectedCards.includes(card.id)
        ? { ...card, front, back, lastModified: currentDate }
        : card
    );

    fetch("http://localhost:3000/flashCards", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCards),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to update selected cards on server");
          throw new Error("Failed to update selected cards on server");
        }
        return response.json();
      })
      .then((updatedCards) => {
        setFlashCards(updatedCards);
      })
      .catch((error) => {
        console.error("Error updating selected cards:", error);
      });
  };

  const handleMarkAsNoted = (e) => {
    e.stopPropagation();
    const newStatus = status === "Want to Learn" ? "Noted" : "Learned";
    const currentDate = new Date().toISOString().split("T")[0];
    fetch(`http://localhost:3000/flashCards/${flashCard.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus, lastModified: currentDate }),
    })
      .then((response) => {
        if (!response.ok) {
          console.error("Failed to update status on server");
          throw new Error("Failed to update status on server");
        }
        return response.json();
      })
      .then((updatedCard) => {
        setFlashCards((prevCards) =>
          prevCards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          )
        );
        setStatus(newStatus);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
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
          {!turn && (
            <div
              className="checkbox-container"
              style={{
                position: "absolute",
                bottom: "0",
                right: "10px",
                zIndex: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedCards.includes(flashCard.id)}
                onChange={() => {}}
                onClick={() => handleCheckboxClick(flashCard.id)}
              />
            </div>
          )}
          <div className="front" ref={frontEl}>
            {editedFront}
          </div>
          <div className="back" ref={backEl}>
            <div className={`answer ${turn ? "flipped" : ""}`}>
              {editedBack}
            </div>
            {turn && status !== "Learned" && (
              <button className="noted-button" onClick={handleMarkAsNoted}>
                Update Status
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
};

export default FlashCards;
