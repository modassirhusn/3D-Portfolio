// pages/HomePage.jsx
import React from "react";
import Scene from "../components/Scene";
import "../components/Main.css";

export default function HomePage() {
  return (
    <div className="site-root page">

      {/* =============================== */}
      {/* TOP HALF (Particles + Components) */}
      {/* =============================== */}
      <section className="upper-half">
        <Scene />
      </section>

      {/* =============================== */}
      {/* LOWER HALF (Your Name & Info) */}
      {/* =============================== */}
      <section className="lower-half">
        <div className="hero-content">
          <h1 className="hero-name">Md Modassir Hussain</h1>

          <h2 className="hero-subtitle">
            Software Engineer & Prompt Engineer
          </h2>

          <p className="hero-description">
            Software Development • Data Annotation • AI Training • Automation
          </p>
        </div>
      </section>

      {/* =============================== */}
      {/* EDUCATION SECTION (Scroll Down) */}
      {/* =============================== */}
      <section className="education-section">
        <h1 className="edu-title">Education</h1>

        <div className="edu-grid">

          <div className="edu-card">
            <h2>Matriculation (10th)</h2>
            <p className="edu-year">2016 – 2018</p>
            <p className="edu-inst">Holy garden Model School, Benajita</p>
            <p className="edu-desc">
              Completed secondary education with strong interest in mathematics,
              with Science Branch.
            </p>
          </div>

          <div className="edu-card">
            <h2>Intermediate (12th)</h2>
            <p className="edu-year">2018 – 2020</p>
            <p className="edu-inst">Bokaro Public School, Bokaro</p>
            <p className="edu-desc">
              Studied PCM — built foundation in programming, reasoning,
              technology and analytical thinking.
            </p>
          </div>

          <div className="edu-card">
            <h2>B.Tech in CSE</h2>
            <p className="edu-year">2021 – 2025</p>
            <p className="edu-inst">Dumka Engineering College, Dumka</p>
            <p className="edu-desc">
              Specialized in Software Engineering, AI Training, Cloud
              Integration, Automation & System Architecture.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
