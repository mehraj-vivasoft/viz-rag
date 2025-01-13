"use client";
import React from "react";
import { marked } from "marked";
import { MdDelete } from "react-icons/md";
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
    queryEntries(params.collection_name, queryText, 10).then((c) =>
      setCollections(c)
    );
    setIsLoading(false);
  }, [queryText, params.collection_name]);

  return (
    <div className="w-screen h-full overflow-auto p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <h1 className="text-3xl font-bold text-left mb-8 font-[family-name:var(--font-geist-mono)]">
          _VizRag x _PiHR Dataset
        </h1>
        <div className="flex gap-3 h-min">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-200 border-2 border-black rounded-md min-w-[450px] px-3 py-1 focus:outline-none"
          />
          <Link
            href={`/pihr/${params.collection_name}/query?query=${query}`}
            className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-white hover:border border-slate-950 hover:scale-110 transition ease-in-out duration-300"
          >
            Query
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-6 items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-white" />
          <p className="ml-4 text-white">COLLECTIONS ARE BEING LOADED</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition-shadow border border-slate-950 flex flex-col"
              >
                <div className="flex justify-between">
                  <h2 className="text-white rounded-xl text-xl font-semibold mb-4 w-fit px-4 py-1.5 bg-black">
                    {collection.properties.document_type}
                  </h2>
                  <MdDelete
                    className="text-slate-950 hover:text-red-800 hover:cursor-pointer hover:scale-110 transition ease-in-out duration-300"
                    size={32}
                  />
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
                <div className="flex gap-2">
                  {collection.properties.tag.map((tag) => (
                    <span
                      key={tag}
                      className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:bg-gray-900 hover:scale-110 tranition ease-in-out duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  {collection.distance && (
                    <p className="mt-4 text-right text-slate-950 bg-slate-100 border-y-2 border-slate-950 px-4 py-2 rounded-lg">
                      Distance: {collection.distance}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
