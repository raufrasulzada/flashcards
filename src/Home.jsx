import React from "react";
import Project from "./Project";
import "./style/Home.css";

const projects = [
  {
    title: "Book Store Management",
    description: "Database application for a Book Store Management system.",
    link: "https://github.com/raufrasulzada/dbs-as2",
  },
  {
    title: "DummyJSON Product API",
    description:
      "Fetches products using DummyJSON API and dynamically displays them.",
    link: "https://raufrasulzada.github.io/dummyjson-product/",
  },
  {
    title: "Portfolio",
    description: "My Online Portfolio.",
    link: "https://raufrasulzada.github.io",
  },
];

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Webpage!</h1>
      <p>
        I'm 19 years old, a third year student of ADA University. My aspire is
        to pursue the career of software development. Here are some projects
        I've worked on:
      </p>
      <ul className="project-list">
        {projects.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </ul>
    </div>
  );
}

export default Home;
