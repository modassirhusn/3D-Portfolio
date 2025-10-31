import React from "react";
import Scene from "../components/Scene";
// Import each project component individually
import { Project1, Project2, Project3, Project4 } from "../components/Projects";
import "../components/Main.css";

export default function HomePage() {
  return (
    <div className="site-root">
      {/* Section 1: The Hero Scene */}
      <section className="page-hero">
        <Scene />
      </section>

      {/* Each project is now its own full-page section */}
      <section className="project-page">
        <Project1 />
      </section>
      <section className="project-page">
        <Project2 />
      </section>
      <section className="project-page">
        <Project3 />
      </section>
      <section className="project-page">
        <Project4 />
      </section>
    </div>
  );
}