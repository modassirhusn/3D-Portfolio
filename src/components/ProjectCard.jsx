// src/components/ProjectCard.jsx
import React from "react";
import "./Main.css";

export default function ProjectCard({ title, desc, link, tech }) {
  return (
    <article className="project-card">
      <div className="card-3d">
        <div className="card-face">
          <h3>{title}</h3>
          <p>{desc}</p>
          <p className="tech">{tech}</p>
          {link && <a className="project-link" href={link} target="_blank" rel="noreferrer">View</a>}
        </div>
      </div>
    </article>
  );
}
