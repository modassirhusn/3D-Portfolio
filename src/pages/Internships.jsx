// pages/Internships.jsx
import React from "react";
import "../components/Main.css";

export default function Internships() {
  return (
    <section className="page internships-page">
      <h1 className="page-title">Internship Experience</h1>

      <div className="internship-card">
        <h2>App Developer – Shining Craz</h2>
        <p>Assisted in data structuring for app modules involving bookings, payments, and map integrations,reduced app glitches by 40% .</p>
        <p> Supported testing and QA validation of mobile app data flow using Firebase, analyzed data statistics.</p>
        <p>Gained experience in reviewing and improving working with customers, executives, and technical leads increased clients' success by 30%.</p>
        <p className="tech">Skills:Python, React Native, Node.js, and SQL.</p>
      </div>
    </section>
  );
}
