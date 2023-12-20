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
  setCreateCardModalOpen,
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

  const handleSave = async (event) => {
    event.preventDefault();
    setCreateCardModalOpen(false);

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

      try {
        const response = await fetch("http://localhost:3000/flashCards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCard),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Card added successfully:", data);

          setFlashCards((prevCards) => [...prevCards, data]);

          setEditingCardId(data.id);
          onAddCard(data);
        } else {
          console.error("Failed to add card to server");
        }
      } catch (error) {
        console.error("Error adding card:", error);
      }
    }

    setFront("");
    setBack("");
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
      <form>
        <div className="modal-content">
          <span className="close" onClick={handleClose}>
            &times;
          </span>
          <h2>{editingCardId ? "Edit Card" : "Add New Card"}</h2>
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
          <button type="submit" onClick={handleSave}>
            {editingCardId ? "Save Changes" : "Add Card"}
          </button>
        </div>
      </form>
    </div>
  );
}
