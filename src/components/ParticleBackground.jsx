// src/components/ParticleBackground.js
import React, { useEffect, useRef } from "react";

/*
  Restored original particle network (spatial hash, dense connections),
  with a light FPS-aware guard to reduce heavy connection drawing on slow devices.
*/

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999, radius: 160, clicking: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    // DPR support
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // visibility handling
    let visible = !document.hidden;
    const onVisibility = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    // mouse tracking + touch
    const onMove = (e) => {
      mouse.current.x = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? -9999;
      mouse.current.y = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY) ?? -9999;
    };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };
    const onDown = () => {
      mouse.current.clicking = true;
      mouse.current.radius = 300;
      setTimeout(() => {
        mouse.current.clicking = false;
        mouse.current.radius = 160;
      }, 220);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("touchstart", onDown, { passive: true });

    // adaptive particle count (original tuning)
    const area = window.innerWidth * window.innerHeight;
    let totalTarget = Math.floor(area / 16000);
    totalTarget = Math.max(60, Math.min(420, totalTarget));
    if (window.innerWidth < 700) totalTarget = Math.floor(totalTarget * 0.45);

    // layers
    const layers = 2;
    const particles = [];

    // spatial grid
    const GRID_SIZE = 110;
    let grid = {};

    const hashKey = (x, y) => {
      const gx = Math.floor(x / GRID_SIZE);
      const gy = Math.floor(y / GRID_SIZE);
      return `${gx},${gy}`;
    };

    const neighborKeys = (x, y) => {
      const gx = Math.floor(x / GRID_SIZE);
      const gy = Math.floor(y / GRID_SIZE);
      const keys = [];
      for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++) keys.push(`${gx + xx},${gy + yy}`);
      return keys;
    };

    class Particle {
      constructor(depth) {
        this.depth = depth;
        this.init(true);
      }
      init(seed) {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = (0.8 + Math.random() * 1.8) * (1 + this.depth * 0.5);
        const base = 0.28 + this.depth * 0.26;
        this.vx = (Math.random() - 0.5) * base;
        this.vy = (Math.random() - 0.5) * base;
        this.hue = 190 + Math.random() * 70;
        this.age = 0;
        if (!seed && Math.random() < 0.015) {
          this.x = Math.random() * window.innerWidth;
          this.y = Math.random() * window.innerHeight;
        }
      }
      update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.x < -20) this.x = window.innerWidth + 20;
        if (this.x > window.innerWidth + 20) this.x = -20;
        if (this.y < -20) this.y = window.innerHeight + 20;
        if (this.y > window.innerHeight + 20) this.y = -20;

        const dx = this.x - mouse.current.x;
        const dy = this.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const effectiveRadius = mouse.current.radius * (1 + this.depth * 0.35);

        if (dist < effectiveRadius) {
          const strength = (1 - dist / (effectiveRadius + 0.001)) * (0.7 + this.depth * 0.6);
          this.x += (dx > 0 ? strength : -strength) * 0.7;
          this.y += (dy > 0 ? strength : -strength) * 0.7;
        }

        if (mouse.current.clicking && dist < effectiveRadius * 1.05) {
          const force = (1 - dist / (effectiveRadius + 0.001)) * (6 / (this.depth + 1));
          this.x += (dx / (dist + 0.01)) * force;
          this.y += (dy / (dist + 0.01)) * force;
        }

        this.age += dt;
      }
      draw(ctx) {
        ctx.beginPath();
        const alpha = 0.6 + this.depth * 0.12;
        ctx.fillStyle = `hsla(${this.hue},100%,58%,${alpha})`;
        ctx.shadowColor = `hsla(${this.hue},100%,65%,0.85)`;
        ctx.shadowBlur = Math.min(24, 8 + this.depth * 12);
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // init
    const initParticles = () => {
      particles.length = 0;
      grid = {};
      for (let depth = 0; depth < layers; depth++) {
        const portion = depth === 0 ? 0.6 : 0.4;
        const count = Math.max(8, Math.floor(totalTarget * portion));
        for (let i = 0; i < count; i++) particles.push(new Particle(depth));
      }
    };
    initParticles();

    // animation loop + simple FPS monitor to reduce heavy drawing on slow devices
    let last = performance.now();
    let running = true;
    let frames = 0;
    let fps = 60;
    let fpsLast = performance.now();

    const MAX_CONN_DIST_BASE = 120;
    const MAX_CONN_DIST_SQ_BASE = MAX_CONN_DIST_BASE * MAX_CONN_DIST_BASE;

    const step = (now) => {
      if (!running) return;
      frames++;
      const dtRaw = now - last;
      last = now;
      const dt = Math.min(2.2, dtRaw / 16.67);

      // update fps every 500ms
      if (now - fpsLast >= 500) {
        fps = Math.round((frames * 1000) / (now - (fpsLast)));
        frames = 0;
        fpsLast = now;
      }

      requestAnimationFrame(step);

      if (!visible) return;

      // rebuild grid
      grid = {};
      for (const p of particles) {
        const key = hashKey(p.x, p.y);
        if (!grid[key]) grid[key] = [];
        grid[key].push(p);
      }

      // clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const camX = Math.sin(now * 0.0001) * 6;
      const camY = Math.cos(now * 0.00008) * 6;
      ctx.translate(camX, camY);

      // update & draw particles
      for (const p of particles) {
        p.update(dt);
        p.draw(ctx);
      }

      // adjust connection distance & intensity based on fps (performance guard)
      let MAX_CONN_DIST = MAX_CONN_DIST_BASE;
      if (fps < 28) MAX_CONN_DIST = 90;
      const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST;

      // draw connections (spatial grid neighbors)
      for (const key in grid) {
        const list = grid[key];
        for (let i = 0; i < list.length; i++) {
          const a = list[i];
          const keys = neighborKeys(a.x, a.y);
          for (const k of keys) {
            const nb = grid[k];
            if (!nb) continue;
            for (let j = 0; j < nb.length; j++) {
              const b = nb[j];
              if (a === b) continue;
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const d2 = dx * dx + dy * dy;
              if (d2 > MAX_CONN_DIST_SQ) continue;
              const alpha = Math.max(0, 0.95 - d2 / MAX_CONN_DIST_SQ) * (fps < 28 ? 0.12 : 0.16);
              const avgHue = Math.round((a.hue + b.hue) * 0.5 + (now * 0.01) % 360);
              ctx.strokeStyle = `hsla(${avgHue},100%,55%,${alpha})`;
              ctx.lineWidth = Math.max(0.3, 0.9 * alpha);
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // attachment on clicking
      if (mouse.current.clicking) {
        const keys = neighborKeys(mouse.current.x, mouse.current.y);
        const nearby = [];
        for (const k of keys) {
          const list = grid[k];
          if (!list) continue;
          for (const p of list) {
            const dx = p.x - mouse.current.x;
            const dy = p.y - mouse.current.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < (mouse.current.radius * mouse.current.radius)) nearby.push({ p, d2 });
          }
        }
        nearby.sort((a, b) => a.d2 - b.d2);
        const attachCount = Math.min(18, nearby.length);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.arc(mouse.current.x, mouse.current.y, 12, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < attachCount; i++) {
          const node = nearby[i].p;
          const dx = node.x - mouse.current.x;
          const dy = node.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = 0.95 - dist / (mouse.current.radius + 1);
          const hue = Math.round(node.hue + (now * 0.02) % 360);
          ctx.strokeStyle = `hsla(${hue},100%,62%,${Math.max(0.12, alpha * 0.9)})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.current.x, mouse.current.y);
          const cx = (mouse.current.x + node.x) / 2 + (Math.random() - 0.5) * 12;
          const cy = (mouse.current.y + node.y) / 2 + (Math.random() - 0.5) * 12;
          ctx.quadraticCurveTo(cx, cy, node.x, node.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
    };

    requestAnimationFrame(step);

    // cleanup
    return () => {
      running = false;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("touchstart", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-network-upgraded" aria-hidden="true" />;
}
