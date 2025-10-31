import React from 'react';
import './Main.css';

const Project1 = () => (
  <div className="project-content">
    <h2>Project #1: E-Commerce Platform</h2>
    <p>A full-stack e-commerce website built with the MERN stack, featuring product browsing, a shopping cart, user authentication with JWT, and a Stripe integration for payments.</p>
  </div>
);

const Project2 = () => (
  <div className="project-content">
    <h2>Project #2: Real-Time Chat App</h2>
    <p>A responsive chat application using Socket.IO, Express, and React. Allows users to join rooms, send messages, and see who is currently online, all updated in real-time.</p>
  </div>
);

const Project3 = () => (
  <div className="project-content">
    <h2>Project #3: Portfolio Website</h2>
    <p>The very site you're on now! A creative portfolio built with React and Three.js, featuring a custom particle system and interactive physics-based animations to create an engaging user experience.</p>
  </div>
);

const Project4 = () => (
  <div className="project-content">
    <h2>Project #4: Data Visualization Dashboard</h2>
    <p>A dashboard for visualizing complex datasets using D3.js and React. Fetches data from a public API and renders interactive charts and graphs for insightful analysis.</p>
  </div>
);

export { Project1, Project2, Project3, Project4 };