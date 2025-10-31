import React, { useEffect, useState, useMemo, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const ParticleBackground = ({ onInitialized }) => {
  const [init, setInit] = useState(false);
  const [particleCount, setParticleCount] = useState(140);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
      if (onInitialized) {
        onInitialized();
      }
    });
  }, [onInitialized]);

  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth;
      if (w < 420) setParticleCount(60);
      else if (w < 768) setParticleCount(100);
      else if (w < 1200) setParticleCount(120);
      else setParticleCount(140);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "transparent" },
      detectRetina: true,
      fpsLimit: 60,
      // THIS IS THE FIX: It tells the particles to ignore scroll gestures.
      motion: { disable: true },
      particles: {
        number: {
          value: particleCount,
          density: { enable: true, area: 900 },
        },
        color: { value: ["#00fff7", "#19d7c9", "#00e6b8"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.9,
          random: { enable: true, minimumValue: 0.35 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.25,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 140,
          color: "#19d7c9",
          opacity: 0.22,
          width: 1.2,
          triangles: {
            enable: true,
            color: { value: "#0b3b36" },
            opacity: 0.05,
            stroke: { width: 0.6, color: "#0e4b44" },
          },
        },
        move: {
          enable: true,
          speed: 0.6,
          random: true,
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: { repulse: { distance: 120, duration: 0.4 }, push: { quantity: 3 } },
      },
    }),
    [particleCount]
  );

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return <></>;
};

export default memo(ParticleBackground);