import React from "react";
import "./style/Project.css";

function Project({ title, description, link }) {
  const handleClick = () => {
    window.open(link, "_blank");
  };

  return (
    <li className="cardProj" onClick={handleClick}>
      <strong className="link">{title}:</strong> {description}
    </li>
  );
}

export default Project;
