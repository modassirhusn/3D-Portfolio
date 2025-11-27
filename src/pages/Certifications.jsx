import React from "react";
import "../components/Main.css"; // for neon, cards, grid, animations

export default function Certifications() {
  const certificates = [
    {
      title: "Pyhton IT(Manual & Automation)",
      issuer: "Google, Coursera",
      year: "2024",
    },
    {
      title: "Delloit Data Analytics",
      issuer: "Delloite, Forge",
      year: "2025",
    },
    {
      title: "Cloud Management",
      issuer: "Google, Coursera",
      year: "2024",
    },
    {
      title: "App Development",
      issuer: "Shining Carz, Internship",
      year: "2024",
    },
  ];

  return (
    <div className="page">
      <h1 className="hero-name" style={{ textAlign: "center", marginTop: "30px" }}>
        Certifications
      </h1>

      <div className="projects-grid">
        {certificates.map((cert, index) => (
          <div className="project-card" key={index}>
            <div className="card-3d">
              <h2>{cert.title}</h2>
              <p>
                <strong>Issuer:</strong> {cert.issuer}
              </p>
              <p>
                <strong>Year:</strong> {cert.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
