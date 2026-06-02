import React from "react";

interface InfoPageProps {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const InfoPage: React.FC<InfoPageProps> = ({ title, description, lastUpdated, children }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
      {description && <p className="text-gray-500 mb-8">{description}</p>}
      {lastUpdated && <p className="text-xs text-gray-400 mb-8 italic">Last updated: {lastUpdated}</p>}
      <div className="prose prose-blue max-w-none">
        {children}
      </div>
    </div>
  );
};

export default InfoPage;
