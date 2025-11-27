// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Projects from "./pages/Projects";
import Internships from "./pages/Internships";
import Education from "./pages/Education";           // NEW
import Certifications from "./pages/Certifications"; // NEW
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/education" element={<Education />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>
    </Router>
  );
}


