import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticleBackground from "./ParticleBackground";
import "./Main.css";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

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
        const fps = Math.max(0, Math.round((frames * 1000) / delta));
        setCurrentFPS(fps);
        frames = 0;
        last = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const clearBriefHide = () => {
      if (briefHideTimerRef.current) clearTimeout(briefHideTimerRef.current);
    };
    if (currentFPS <= FPS_PERSISTENT_MAX) {
      clearBriefHide();
      if (warningType !== "persistent") {
        setWarningType("persistent");
        setShowWarning(true);
      }
      return;
    }
    if (warningType === "persistent") {
      setShowWarning(false);
      setWarningType(null);
    }
    if (currentFPS >= FPS_BRIEF_MIN && currentFPS <= FPS_BRIEF_MAX) {
      if (briefCooldownRef.current) return;
      if (warningType !== "brief") {
        setWarningType("brief");
        setShowWarning(true);
        briefHideTimerRef.current = setTimeout(() => {
          setShowWarning(false);
          setWarningType(null);
        }, BRIEF_VISIBLE_MS);
      }
      return;
    }
    clearBriefHide();
    if (briefCooldownRef.current) clearTimeout(briefCooldownRef.current);
    if (showWarning) setShowWarning(false);
    if (warningType) setWarningType(null);
  }, [currentFPS, warningType, showWarning]);

  const onDismissBrief = () => {
    setShowWarning(false);
    setWarningType(null);
    if (briefCooldownRef.current) clearTimeout(briefCooldownRef.current);
    briefCooldownRef.current = setTimeout(() => {
      briefCooldownRef.current = null;
    }, BRIEF_COOLDOWN_MS);
  };

  const onReloadNow = () => {
    try {
      window.location.reload();
    } catch (e) {
      setShowWarning(false);
      setWarningType(null);
    }
  };

  useEffect(() => {
    return () => {
      if (briefHideTimerRef.current) clearTimeout(briefHideTimerRef.current);
      if (briefCooldownRef.current) clearTimeout(briefCooldownRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const chargeTimerRef = useRef(null);
  const wasChargedRef = useRef(false);
  const pressStartTime = useRef(null);
  const CHARGE_TO_FULL_MS = 2200;
  const SHORT_PULL_MS = 180;
  const MEDIUM_POWER_THRESHOLD_MS = 500;

  const startCharge = (e) => {
    if (isAnimating) return;
    e.preventDefault();
    pressStartTime.current = Date.now();
    wasChargedRef.current = false;
    setCharging(true);
    chargeTimerRef.current = setTimeout(() => {
      wasChargedRef.current = true;
    }, CHARGE_TO_FULL_MS);
  };

  const releaseAndLaunch = () => {
    if (isAnimating) return;
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    const holdDuration = Date.now() - pressStartTime.current;
    setIsAnimating(true);
    setCharging(false);
    setPowering(true);
    let power = "launch-low";
    let cleanupDuration = 1200;
    if (wasChargedRef.current) {
      power = "launch-high";
      cleanupDuration = 2000;
    } else if (holdDuration > MEDIUM_POWER_THRESHOLD_MS) {
      power = "launch-medium";
      cleanupDuration = 1600;
    }
    setTimeout(() => {
      setLaunchPower(power);
      setLaunched(true);
      setPowering(false);
    }, SHORT_PULL_MS);
    setTimeout(() => {
      setLaunched(false);
      setPowering(false);
      setLaunchPower("");
      setIsAnimating(false);
    }, cleanupDuration);
  };

  const cancelCharge = () => {
    if (chargeTimerRef.current) clearTimeout(chargeTimerRef.current);
    setCharging(false);
  };

  const renderWarning = () => {
    if (!showWarning || !warningType) return null;
    if (warningType === "brief") {
      return (
        <div className="fps-warning-card">
          <div className="fps-warning-title">Performance Notice</div>
          <div className="fps-warning-message">
            Frame rate is <strong>{currentFPS} FPS</strong>. Rendering may be a
            bit slow.
          </div>
          <div className="fps-warning-actions">
            <button className="fps-warning-close" onClick={onDismissBrief}>
              Dismiss
            </button>
          </div>
        </div>
      );
    }
    if (warningType === "persistent") {
      return (
        <div className="fps-warning-card">
          <div className="fps-warning-title">Performance Warning</div>
          <div className="fps-warning-message">
            Frame rate is <strong>{currentFPS} FPS</strong>. This may cause
            noticeable lag.
          </div>
          <div className="fps-warning-actions">
            <button className="fps-warning-close" onClick={onReloadNow}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground onInitialized={handleParticlesInit} />
      <div className="fps-warning-overlay" role="alert" aria-live="assertive">
        {renderWarning()}
      </div>
      <nav className="social-icons">
        <a
          href="https://www.instagram.com/_ayan.s__"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
        <a
          href="https://github.com/Ayan-1315"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/ayan-sen-1315abc"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>
      </nav>
      <div className="hero-content">
        <div className="hero-title">
          <h1 className="hero-name">Md Modassir Hussain</h1>
          <h1 className="hero-icon">
            <button
              className={`code-icon ${isAnimating ? "disabled" : ""} ${
                charging ? "charging" : ""
              } ${powering ? "powering" : ""} ${
                launched ? "launched" : ""
              } ${launchPower}`}
              onMouseDown={startCharge}
              onMouseUp={releaseAndLaunch}
              onMouseLeave={cancelCharge}
              onTouchStart={startCharge}
              onTouchEnd={releaseAndLaunch}
              onTouchCancel={cancelCharge}
              aria-pressed={isAnimating}
              aria-label="Activate icon animation"
              type="button"
            >
              <span className="bracket bracket-left">&lt;</span>
              <span className="slash">/</span>
              <span className="bracket bracket-right">&gt;</span>
            </button>
          </h1>
        </div>

        <p className="subtitle">Software Engineer</p>
        <div className="hero-divider" />
        <p className="tagline">Innovation begins where limits end</p>
      </div>
    </section>
  );
}
