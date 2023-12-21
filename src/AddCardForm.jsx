import React, { useState } from "react";
import "./style/AddCardForm.css";

const AddCardForm = ({ onAddCard, onCancel }) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleAddCard = () => {
    if (!front || !back) {
      alert("Please fill in both front and back details.");
      return;
    }

    onAddCard({ front, back });
    setFront("");
    setBack("");
  };

  return (
    <div className="add-card-form">
      <h3>Add New Card</h3>
      <label>
        Front:
        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
      </label>
      <label>
        Back:
        <input
          type="text"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
      </label>
      <div className="form-buttons">
        <button onClick={handleAddCard}>Save Changes</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default AddCardForm;
