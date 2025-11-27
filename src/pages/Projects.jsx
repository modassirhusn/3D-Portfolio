import React from 'react';
import ProjectCard from '../components/ProjectCard';

const projects = [
  {
    title: 'RaG AI ChatBot',
    desc: 'Built RAG pipeline with LangChain and PaLM; improved resolution accuracy to ~80%.',
    link: 'http://localhost:3000/',
    tech: 'LangChain, PaLM, Vector DB'
  },
  {
    title: 'SWIFTTY App',
    desc: 'Data validation & UI testing; improved app performance and UX.',
    link: 'https://github.com/modassirhusn',
    tech: 'React Native, Firebase'
  },
  {
    title: 'Face Recognition Attendance System',
    desc: 'Real-time face recognition attendance system.',
    link: 'https://github.com/modassirhusn/Face-Recognition-Attendance-System',
    tech: 'Python, OpenCV, React'
  }
];

export default function Projects() {
  return (
    <section className="page projects-page">
      <h1>Projects</h1>
      <div className="projects-grid">
        {projects.map((p,i) =>
          <ProjectCard
            key={i}
            title={p.title}
            desc={p.desc}
            link={p.link}
            tech={p.tech}
          />
        )}
      </div>
    </section>
  );
}
