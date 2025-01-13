"use client";
import React from "react";
import { getCollections } from "./controllers/getCollections";
import Link from "next/link";

const PiHRHome = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [collections, setCollections] = React.useState([]);

  React.useEffect(() => {
    getCollections().then((c) => setCollections(c));
    setIsLoading(false);
  }, []);

  return (
    <div className="w-screen h-screen overflow-auto p-6">
      <h1 className="text-3xl font-bold text-left mb-8 font-[family-name:var(--font-geist-mono)]">
        _VizRag x _PiHR Dataset
      </h1>
      {isLoading ? (
        <div className="flex flex-col gap-6 items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-white" />
          <p className="ml-4 text-white">COLLECTIONS ARE BEING LOADED</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              href={`/pihr/${collection}`}
              key={collection}
              className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-200 transition-shadow"
            >
              <h2 className="text-black text-xl font-semibold mb-4">
                {collection}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PiHRHome;
