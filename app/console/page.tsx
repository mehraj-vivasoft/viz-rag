import React from 'react';

type Project = {
  id: number;
  title: string;
  description: string;
  link: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'PiHR Dataset',
    description: 'The PiHR Dataset is a collection of data related to the PIHR and AutoQuery Integration.',
    link: '/pihr',
  },
];

const VizRagConsole: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 font-[family-name:var(--font-geist-mono)]">_VizRag Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-black text-xl font-semibold mb-4">{project.title}</h2>
            <p className="text-gray-900 mb-6">{project.description}</p>
            <a
              href={project.link}
              className="inline-block bg-slate-950 text-white px-4 py-2 rounded hover:bg-gray-900 hover:scale-110 tranition ease-in-out duration-300"
            >
              Manage
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VizRagConsole;
