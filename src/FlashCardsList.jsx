import React, { useState } from "react";
import FlashCards from "./FlashCards";
import CreateCard from "./CreateCard";
import { handleUpdate } from "./FlashCards";

function FlashCardsList({
  flashCards,
  onDelete,
  setEditingCardId,
  setCreateCardModalOpen,
  setFlashCards,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAttribute, setSortAttribute] = useState("id");

  const handleEdit = (id, front, back) => {
    console.log("Editing card:", id, front, back);
  };

  const handleAddCard = (newCard) => {
    setFlashCards((prevFlashCards) => [...prevFlashCards, newCard]);
  };

  const sortedCards = flashCards
    .filter((card) => {
      const frontText = String(card.front);
      const backText = String(card.back);

      return (
        frontText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .filter((card) => {
      const cardStatus = card.status ? card.status : "unknown";
      return (
        filterStatus === "All" ||
        (cardStatus && cardStatus.toLowerCase() === filterStatus.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortAttribute === "id") {
        return a.id - b.id;
      } else if (sortAttribute === "front") {
        return a.front.localeCompare(b.front);
      } else if (sortAttribute === "back") {
        return a.back.localeCompare(b.back);
      } else if (sortAttribute === "lastModified") {
        return new Date(b.lastModified) - new Date(a.lastModified);
      }
      return 0;
    });

  return (
    <div className="card-container">
      <input
        type="text"
        placeholder="Search cards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Want to Learn">Want to Learn</option>
        <option value="Noted">Noted</option>
        <option value="Learned">Learned</option>
      </select>
      <select
        value={sortAttribute}
        onChange={(e) => setSortAttribute(e.target.value)}
      >
        <option value="id">ID</option>
        <option value="front">Front</option>
        <option value="back">Back</option>
        <option value="lastModified">Last Modified</option>
      </select>
      {sortedCards.map((flashCard) => (
        <FlashCards
          key={flashCard.id}
          flashCard={flashCard}
          onDelete={onDelete}
          onEdit={handleEdit}
          onUpdate={(front, back) =>
            handleUpdate(flashCard.id, front, back, setFlashCards)
          }
        />
      ))}
      <CreateCard
        onClose={() => setCreateCardModalOpen(false)}
        onAddCard={(newCard) => {
          handleAddCard(newCard);
          setCreateCardModalOpen(false);
        }}
        flashCards={flashCards}
        setFlashCards={setFlashCards}
        editingCardId={setEditingCardId}
      />
    </div>
  );
}

export default FlashCardsList;
