import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Main.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

/* =========================
   INLINE STYLES (FIXED)
========================= */
const iconStyle = {
  fontSize: "22px",
  color: "#9fdcff",
  transition: "all 0.3s ease",
};

/* =========================
   SOCIAL ICONS COMPONENT
========================= */
function SocialIcons() {
  const handleEnter = (e) => {
    e.currentTarget.style.color = "#00eaff";
    e.currentTarget.style.transform = "translateX(8px) scale(1.15)";
    e.currentTarget.style.textShadow =
      "0 0 8px rgba(0,234,255,0.8), 0 0 16px rgba(0,234,255,0.6)";
  };

  const handleLeave = (e) => {
    e.currentTarget.style.color = "#9fdcff";
    e.currentTarget.style.transform = "translateX(0) scale(1)";
    e.currentTarget.style.textShadow = "none";
  };

  return (
    <nav
      className="social-icons"
      style={{
        position: "fixed",
        left: "24px",
        top: "22.5%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        zIndex: 9999,
      }}
    >
      <a
        href="https://www.instagram.com/rockeyrkofficial_/"
        target="_blank"
        rel="noreferrer"
        style={iconStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <FaInstagram />
      </a>

      <a
        href="https://github.com/modassirhusn"
        target="_blank"
        rel="noreferrer"
        style={iconStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <FaGithub />
      </a>

      <a
        href="https://www.linkedin.com/in/md-modassir-hussain-"
        target="_blank"
        rel="noreferrer"
        style={iconStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <FaLinkedin />
      </a>
    </nav>
  );
}

/* =========================
   MAIN SCENE COMPONENT
========================= */
export default function Scene() {
  const heroRef = useRef(null);

  const [isAnimating, setIsAnimating] = useState(false);
  const [powering, setPowering] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [charging, setCharging] = useState(false);
  const [launchPower, setLaunchPower] = useState("");

  const [particlesInitialized, setParticlesInitialized] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState(null);

  const briefHideTimerRef = useRef(null);
  const briefCooldownRef = useRef(null);
  const rafRef = useRef(null);

  const FPS_BRIEF_MIN = 11;
  const FPS_BRIEF_MAX = 15;
  const FPS_PERSISTENT_MAX = 10;
  const BRIEF_VISIBLE_MS = 5000;
  const BRIEF_COOLDOWN_MS = 60000;

  const handleParticlesInit = useCallback(() => {
    setParticlesInitialized(true);
  }, []);

  useEffect(() => {
    let last = performance.now();
    let frames = 0;

    const loop = (now) => {
      frames++;
      const delta = now - last;
      if (delta >= 1000) {
        setCurrentFPS(Math.round((frames * 1000) / delta));
        frames = 0;
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const renderWarning = () => {
    if (!showWarning || !warningType) return null;

    return (
      <div className="fps-warning-card">
        <div className="fps-warning-title">
          {warningType === "persistent" ? "Low Performance" : "Performance Notice"}
        </div>
        <div className="fps-warning-message">
          Frame rate is <strong>{currentFPS} FPS</strong>.
        </div>
        <button
          className="fps-warning-close"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground onInitialized={handleParticlesInit} />

      <div className="fps-warning-overlay">{renderWarning()}</div>

      {/* ✅ FIXED SOCIAL ICONS */}
      <SocialIcons />

      {/* 🚀 ROCKET (UNCHANGED) */}
      <div className={`rocket ${launched ? "rocket-launch" : ""}`}>
        <div className="rocket-body">
          <div className="rocket-nose"></div>
          <div className="rocket-fin left"></div>
          <div className="rocket-fin right"></div>
          <div className="rocket-flame"></div>
        </div>
      </div>
    </section>
  );
}
