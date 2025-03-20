"use client";
import React from "react";
import { marked } from "marked";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { queryEntries } from "./queryEntries";

export default function QueryPage({
  params,
}: {
  params: { collection_name: string };
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const queryText = useSearchParams().get("query") || "";
  const [query, setQuery] = React.useState(queryText);
  const [collections, setCollections] = React.useState<
    {
      id: string;
      distance: number;
      properties: {
        document_type: string;
        tag: string[];
        document: string;
      };
    }[]
  >([]);

  React.useEffect(() => {
    setIsLoading(true);
    queryEntries(
      params.collection_name,
      encodeURIComponent(queryText),
      10
    ).then((c) => {
      setCollections(c);
      setIsLoading(false);
    });
  }, [queryText, params.collection_name]);

  return (
    <div className="w-screen min-h-screen overflow-auto p-6 flex flex-col">
      <div className="flex flex-col md:flex-row justify-between">
        <Link
          className="text-3xl font-bold text-left mb-8 font-[family-name:var(--font-geist-mono)]"
          href="/pihr/PIHR_DATASET"
        >
          _VizRag x _PiHR Dataset
        </Link>
        <div className="flex gap-3 h-min">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-200 border-2 border-black rounded-md min-w-[450px] px-3 py-1 focus:outline-none"
          />
          <Link
            href={`/pihr/${
              params.collection_name
            }/query?query=${encodeURIComponent(query)}`}
            className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-white hover:border border-slate-950 hover:scale-110 transition ease-in-out duration-300"
          >
            Query
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-6 items-center justify-center flex-grow">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-transparent border-r-transparent border-gradient-to-br from-purple-500 to-blue-500 shadow-lg" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-900 animate-ping" />
          </div>
          <p className="text-2xl font-semibold mt-8 font-serif bg-gradient-to-t from-black to-slate-400 bg-clip-text text-transparent">
            COLLECTIONS ARE BEING LOADED
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className={`shadow-md rounded-lg p-6 transition-shadow border border-slate-950 flex flex-col ${
                  index < 5 && collection.distance <= 0.5
                    ? "bg-green-100 hover:bg-green-200"
                    : "bg-slate-200 hover:bg-slate-300"
                }`}
              >
                <div
                  className={`mb-4 text-right border-y-2 border-slate-950 px-4 py-2 rounded-lg " 
                      ${
                        collection.distance <= 0.5
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }
                       ${index < 3 && collection.distance <= 0.5 ? "font-bold tracking-wide font-mono" : ""} `}
                >
                  {collection.distance && "Distance: " + collection.distance}
                </div>
                <div className="flex justify-between">
                  <h2 className="text-white rounded-xl text-md font-semibold mb-4 w-fit px-4 py-1.5 bg-black">
                    {collection.properties.document_type}
                  </h2>
                  <div className="flex gap-2 mb-4">
                    {collection.properties.tag.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-950 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-900 hover:scale-110 tranition ease-in-out duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* <MdDelete
                    className="text-slate-950 hover:text-red-800 hover:cursor-pointer hover:scale-110 transition ease-in-out duration-300"
                    size={32}
                  /> */}
                </div>
                <p className="text-gray-900 mb-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(collection.properties.document),
                    }}
                    className="markdown"
                  ></div>
                </p>
                <div className="flex-grow"></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
