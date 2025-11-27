import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`glass-nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">

        {/* Empty brand section */}
        <div className="brand"></div>

        <div className="nav-links">

          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Home
          </Link>

          <Link
            to="/projects"
            className={location.pathname === "/projects" ? "active" : ""}
          >
            Projects
          </Link>

          <Link
            to="/internships"
            className={location.pathname === "/internships" ? "active" : ""}
          >
            Internships
          </Link>

          {/* 🔥 Certifications Page Link */}
          <Link
            to="/certifications"
            className={location.pathname === "/certifications" ? "active" : ""}
          >
            Certifications
          </Link>

        </div>
      </div>
    </nav>
  );
}

