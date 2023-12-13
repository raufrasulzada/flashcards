import React from "react";
import FlashCards from "./FlashCards";
import CreateCard from "./CreateCard";

function FlashCardsList({
  flashCards,
  onDelete,
  setEditingCardId,
  setCreateCardModalOpen,
  setFlashCards,
}) {
  const handleEdit = (id, front, back) => {
    console.log("Editing card:", id, front, back);
  };

  const handleAddCard = (newCard) => {
    console.log("Adding card:", newCard);
    setFlashCards((prevFlashCards) => [...prevFlashCards, newCard]);
  };

  return (
    <div className="card-container">
      {flashCards.map((flashCard) => (
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
