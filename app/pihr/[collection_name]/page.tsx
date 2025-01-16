"use client";
import React from "react";
import { getEntries } from "./controllers/getEntries";
import { marked } from "marked";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "./Paginaton";
import { PAGE_SIZE, PIHR_RAG } from "@/data/const";
import axios from "axios";
import Link from "next/link";

export default function CollectionPage({
  params,
}: {
  params: { collection_name: string };
}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const page = useSearchParams().get("page") || 1;
  const [totalPages, setTotalPages] = React.useState(1);
  const [collections, setCollections] = React.useState<
    {
      id: string;
      properties: {
        document_type: string;
        tag: string[];
        document: string;
      };
    }[]
  >([]);

  React.useEffect(() => {
    getEntries(params.collection_name, Number(page)).then((c) =>
      setCollections(c)
    );
    setIsLoading(false);
  }, [page, params.collection_name]);

  React.useEffect(() => {
    const url = `${PIHR_RAG}/api/v1/rag/entries/count/${params.collection_name}`;
    axios
      .get(url)
      .then((res) => setTotalPages(Math.ceil(res.data / PAGE_SIZE)));
  }, [params.collection_name]);

  return (
    <div className="w-screen min-h-screen flex flex-col overflow-auto p-6">
      <div className="flex flex-col md:flex-row justify-between">
        <Link href={"/pihr"} className="text-3xl font-bold text-left mb-8 font-[family-name:var(--font-geist-mono)]">
          _VizRag x _PiHR Dataset
        </Link>
        <div className="flex gap-3 h-min">
          <Link
            href={`/pihr/${params.collection_name}/query`}
            className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-white hover:border border-slate-950 hover:scale-110 transition ease-in-out duration-300"
          >
            Query
          </Link>
          <Link
            href={`/pihr/${params.collection_name}/add`}
            className="bg-slate-950 text-white px-4 py-2 rounded-lg hover:text-slate-900 hover:bg-white hover:border border-slate-950 hover:scale-110 transition ease-in-out duration-300"
          >
            ADD ENTRY
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
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white shadow-md rounded-lg p-6 hover:bg-gray-50 transition-shadow border border-slate-950"
              >
                <div className="flex justify-between">
                  <h2 className="text-white rounded-xl text-xl font-semibold mb-4 w-fit px-4 py-1.5 bg-black">
                    {collection.properties.document_type}
                  </h2>
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
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center items-center mt-12">
            <PaginationComponent page={Number(page)} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
