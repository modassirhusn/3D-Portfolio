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
    } catch {
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
            Frame rate is <strong>{currentFPS} FPS</strong>.
          </div>

          <button className="fps-warning-close" onClick={onDismissBrief}>
            Dismiss
          </button>
        </div>
      );
    }

    if (warningType === "persistent") {
      return (
        <div className="fps-warning-card">
          <div className="fps-warning-title">Low Performance</div>
          <div className="fps-warning-message">
            Frame rate is <strong>{currentFPS} FPS</strong>.
          </div>

          <button className="fps-warning-close" onClick={onReloadNow}>
            Reload
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="hero-container" ref={heroRef}>
      <ParticleBackground onInitialized={handleParticlesInit} />

      <div className="fps-warning-overlay">{renderWarning()}</div>

      <nav className="social-icons">
        <a href="https://www.instagram.com/rockeyrkofficial_/"><FaInstagram /></a>
        <a href="https://github.com/modassirhusn"><FaGithub /></a>
        <a href="www.linkedin.com/in/md-modassir-hussain-"><FaLinkedin /></a>
      </nav>


      {/* 🚀 INSERTED ROCKET — NO OTHER CHANGES */}
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

