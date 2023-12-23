import React, { useState, useEffect, useRef, useCallback } from "react";
import FlashCards from "./FlashCards";
import AddCardForm from "./AddCardForm";
import { handleUpdate } from "./FlashCards";
import "./style/Spinner.css";

const PAGE_SIZE = 15;

const FlashCardsList = ({ onDelete, setFlashCards: setFlashCards }) => {
  const [flashCards, setLocalFlashCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortAttribute, setSortAttribute] = useState("lastModified");
  const [isAddCardFormVisible, setIsAddCardFormVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const pageRef = useRef(1);

  useEffect(() => {
    fetchFlashCards();
  }, []);

  const fetchFlashCards = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/flashCards?_sort=order&_order=asc&_page=1&_limit=${PAGE_SIZE}`
      );
      const existingData = await response.json();

      const lastAddedResponse = await fetch(
        `http://localhost:3000/flashCards?_page=1&_limit=1&_sort=lastModified&_order=desc`
      );
      const lastAddedData = await lastAddedResponse.json();

      const mergedFlashCards =
        lastAddedData.length > 0
          ? [
              ...existingData,
              ...lastAddedData.filter(
                (card) =>
                  !existingData.some(
                    (existingCard) => existingCard.id === card.id
                  )
              ),
            ]
          : existingData;

      setLocalFlashCards(mergedFlashCards);
    } catch (error) {
      console.error("Error fetching flash cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= scrollHeight - 50 && !loading) {
      fetchMoreFlashCards();
    }
  };

  const fetchMoreFlashCards = useCallback(async () => {
    setLoading(true);
    try {
      const nextPage = pageRef.current + 1;
      await new Promise((resolve) => setTimeout(resolve, 800));
      const response = await fetch(
        `http://localhost:3000/flashCards?_page=${nextPage}&_limit=${PAGE_SIZE}`
      );
      const data = await response.json();
      const updatedData = data.map((card, index) => ({
        ...card,
        order: flashCards.length + index + 1,
      }));

      setLocalFlashCards((prevFlashCards) => [
        ...prevFlashCards,
        ...updatedData,
      ]);
      pageRef.current = nextPage;
    } catch (error) {
      console.error("Error fetching more flash cards:", error);
    } finally {
      setLoading(false);
    }
  }, [flashCards]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleAddCard = (newCard) => {
    fetch("http://localhost:3000/flashCards?_sort=id&_order=desc&_limit=1")
      .then((response) => response.json())
      .then(([latestCard]) => {
        const nextId = latestCard ? latestCard.id + 1 : 1;
        fetch("http://localhost:3000/flashCards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            front: newCard.front,
            back: newCard.back,
            status: "Want to Learn",
            lastModified: new Date().toISOString().split("T")[0],
            order: nextId,
          }),
        })
          .then((response) => response.json())
          .then((addedCard) => {
            setLocalFlashCards([...flashCards, addedCard]);
            setIsAddCardFormVisible(false);
          })
          .catch((error) => {
            console.error("Error adding card:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching latest card:", error);
      });
  };

  const handleCheckboxChange = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards((prevSelectedCards) =>
        prevSelectedCards.filter((id) => id !== cardId)
      );
    } else {
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, cardId]);
    }
  };

  const handleShareCard = () => {
    const selectedCardDetails = selectedCards.map((cardId) => {
      const selectedCard = flashCards.find((card) => card.id === cardId);
      return {
        id: selectedCard.id,
        front: selectedCard.front,
        back: selectedCard.back,
        lastModified: selectedCard.lastModified,
        status: selectedCard.status,
        order: selectedCard.order,
      };
    });

    const emailBody = JSON.stringify(selectedCardDetails, null, 2);
    const emailSubject = "Flash Cards Selection";

    window.location.href = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
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
    <div>
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
        <button
          className={`btn add-card-button ${
            selectedCards.length > 0 ? "selected-cards" : ""
          }`}
          onClick={() => setIsAddCardFormVisible(true)}
        >
          Add Card
        </button>

        <button
          className="btn share-card-button"
          onClick={handleShareCard}
          style={{
            visibility: selectedCards.length > 0 ? "visible" : "hidden",
          }}
        >
          Share Card
        </button>
      </div>

      {isAddCardFormVisible && (
        <div className="add-card-form-container">
          <AddCardForm
            onAddCard={handleAddCard}
            onCancel={() => setIsAddCardFormVisible(false)}
          />
        </div>
      )}

      <div className="card-container">
        {sortedCards.map((flashCard) => (
          <FlashCards
            key={flashCard.id}
            flashCard={flashCard}
            flashCards={flashCards}
            onDelete={onDelete}
            onUpdate={(id, front, back, flashCards, order) =>
              handleUpdate(id, front, back, order, flashCards, setFlashCards)
            }
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            onCheckboxChange={handleCheckboxChange}
            setFlashCards={setFlashCards}
          />
        ))}
      </div>
      <h1 className="loading-text">
        {loading && !isFetchingMore && <div>Loading...</div>}
      </h1>
    </div>
  );
};

export default FlashCardsList;
