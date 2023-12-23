import React, { useState, useEffect, useRef } from "react";

import "./style/ShareCards.css";

const currentDate = new Date().toISOString().split("T")[0];

const handleUpdate = async (
  id,
  front,
  back,
  order,
  flashCards,
  setFlashCards
) => {
  try {
    const updatedFlashCards = flashCards.map((card) => {
      if (card.id === id) {
        return {
          ...card,
          front,
          back,
          order,
        };
      }
      return card;
    });

    await fetch(`http://localhost:3000/flashCards/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order,
      }),
    });
    const updateOrderPromises = updatedFlashCards
      .filter((card) => card.id !== id)
      .map((card) => {
        return fetch(`http://localhost:3000/flashCards/${card.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: card.order,
          }),
        });
      });

    await Promise.all(updateOrderPromises);

    setFlashCards(updatedFlashCards);
  } catch (error) {
    console.error("Error updating card:", error);
  }
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
  const [currentCard, setCurrentCard] = useState(flashCard);

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

  function dragStartHandler(e, flashCard) {
    setCurrentCard({ ...flashCard });
    console.log("drag", flashCard);
  }

  function dragEndHandler(e) {
    e.target.style.background = "white";
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.target.style.background = "lightgray";
  }

  async function dropHandler(e, targetFlashCard) {
    e.preventDefault();

    if (currentCard && targetFlashCard) {
      const updatedFlashCards = flashCards.map((c) => {
        if (c.id === targetFlashCard.id) {
          return { ...c, order: currentCard.order };
        }
        if (c.id === currentCard.id) {
          return { ...c, order: targetFlashCard.order };
        }
        return c;
      });

      const updateOrderPromises = updatedFlashCards.map((card) => {
        return fetch(`http://localhost:3000/flashCards/${card.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: card.order,
          }),
        });
      });

      await Promise.all(updateOrderPromises);

      setFlashCards(updatedFlashCards);
    } else {
      console.error(
        "Invalid currentCard or targetFlashCard:",
        currentCard,
        targetFlashCard
      );
    }

    e.target.style.background = "white";
  }

  const dropHandlerWrapper = (e, flashCard) => {
    if (currentCard) {
      dropHandler(e, flashCard);
    } else {
      console.error("Invalid currentCard:", currentCard);
    }
  };

  return (
    <div
      key={flashCard.id}
      className={`card ${turn ? "turn" : ""} ${editMode ? "edit-mode" : ""}`}
      style={{ height: height }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={(e) => {
        dragStartHandler(e, flashCard);
      }}
      onDragLeave={(e) => {
        dragEndHandler(e);
      }}
      onDragEnd={(e) => {
        dragEndHandler(e);
      }}
      onDragOver={(e) => {
        dragOverHandler(e);
      }}
      onDrop={(e) => {
        dropHandlerWrapper(e, flashCard);
      }}
      draggable={true}
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
