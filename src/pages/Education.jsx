import React from "react";
import Scene from "../components/Scene";
import "../components/Main.css";

export default function Education() {
  return (
    <div className="page education-page">
      <Scene />

      <section className="edu-section">
        <h1 className="edu-title">Education</h1>

        <div className="edu-grid">

          <div className="edu-card">
            <h2>Bachelor of Technology (B.Tech) — Computer Science and Engineering</h2>
            <p className="edu-inst">Dumka Engineering College </p>
            <p className="edu-year">2021 – 2025</p>
            <p className="edu-desc">
              Studied Data Structures, Algorithms, Operating Systems, DBMS, AI, ML & Cloud.
            </p>
          </div>

          <div className="edu-card">
            <h2>Intermediate (Science)</h2>
            <p className="edu-inst"> Bokaro Public School CBSE</p>
            <p className="edu-year">2019 – 2021</p>
            <p className="edu-desc">
              Completed Physics, Chemistry, Mathematics with Computer Science.
            </p>
          </div>

          <div className="edu-card">
            <h2>Matriculation</h2>
            <p className="edu-inst"> Holy garden Model School CBSE</p>
            <p className="edu-year">2017 – 2018</p>
            <p className="edu-desc">
              Core foundation in mathematics, science and computer basics.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
