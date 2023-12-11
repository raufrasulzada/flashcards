import React, { useState } from "react";
import "./style/Project.css";

function Project({ title, description, link }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.open(link, "_blank");
  };

  return (
    <li
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <strong className="link">{title}:</strong> {description}
    </li>
  );
}

export default Project;
