// Update FlashCardsList.jsx

import React, { useState } from "react";
import FlashCards from "./FlashCards";
import CreateCard from "./CreateCard";

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
    console.log("Adding card:", newCard);
    setFlashCards((prevFlashCards) => [...prevFlashCards, newCard]);
  };

  const filteredCards = flashCards
    .filter(
      (card) =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((card) =>
      filterStatus === "All"
        ? true
        : card.status &&
          card.status.toLowerCase() === filterStatus.toLowerCase()
    )
    .sort((a, b) => {
      if (sortAttribute === "id") {
        return a.id - b.id;
      } else if (sortAttribute === "front") {
        return a.front.localeCompare(b.front);
      } else if (sortAttribute === "back") {
        return a.back.localeCompare(b.back);
      }
      return 0;
    });

  console.log("Filter Status:", filterStatus);
  console.log("Filtered Cards:", filteredCards);

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
      </select>
      {filteredCards.map((flashCard) => (
        <FlashCards
          key={flashCard.id}
          flashCard={flashCard}
          onDelete={onDelete}
          setEditingCardId={setEditingCardId}
          setCreateCardModalOpen={setCreateCardModalOpen}
          onEdit={(id, front, back) => handleEdit(id, front, back)}
        />
      ))}
      <CreateCard
        onClose={() => setCreateCardModalOpen(false)}
        onAddCard={(newCard) => {
          console.log("Adding card:", newCard);
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
