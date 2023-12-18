import React, { useState, useEffect } from "react";
import "./style/CreateCard.css";

export default function CreateCard({
  onClose,
  onAddCard,
  flashCards,
  setFlashCards,
  editingCardId,
  setEditingCardId,
  createCardModalOpen,
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    if (editingCardId) {
      const cardToEdit = flashCards.find((card) => card.id === editingCardId);
      if (cardToEdit) {
        setFront(cardToEdit.front);
        setBack(cardToEdit.back);
      }
    }
  }, [editingCardId, flashCards]);

  const handleSave = () => {
    if (editingCardId) {
      setFlashCards((prevCards) =>
        prevCards.map((card) =>
          card.id === editingCardId ? { ...card, front, back } : card
        )
      );
      console.log("Card edited:", { id: editingCardId, front, back });
      setEditingCardId(null);
    } else {
      const currentDate = new Date().toISOString().split("T")[0];
      const newCard = {
        id: flashCards.length + 1,
        front,
        back,
        lastModified: currentDate,
        status: "Want to Learn",
      };
      setFlashCards([...flashCards, newCard]);
      onAddCard(newCard);
      console.log("Card added:", newCard);
    }
    setFront("");
    setBack("");
    onClose();
  };

  const handleClose = () => {
    setEditingCardId(null);

    if (!editingCardId) {
      setFlashCards((prevCards) =>
        prevCards.filter((card) => card.id !== flashCards.length + 1)
      );
    }
    onClose();
  };

  return (
    <div className={`modal ${createCardModalOpen ? "open" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>{editingCardId ? "Add Card" : "Add New Card"}</h2>
        <label>
          Front (Question):
          <input
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
        </label>
        <label>
          Back (Answer):
          <input
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
        </label>
        <button onClick={handleSave}>
          {editingCardId ? "Save Changes" : "Add Card"}
        </button>
      </div>
    </div>
  );
}
