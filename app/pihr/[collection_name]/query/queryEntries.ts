import { PIHR_RAG } from "@/data/const";
import axios from "axios";

export async function queryEntries(
  collection_name: string,
  query: string,
  topK: number
): Promise<
  {
    id: string;
    distance: number;
    properties: {
      document_type: string;
      tag: string[];
      document: string;
    };
  }[]
> {
  if (query.length === 0) {
    return [];
  }
  const url = `${PIHR_RAG}/api/v1/rag/query/${collection_name}/${query}?topk=${topK}`;
  const data = await axios.get(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.data.entries.map((entry: any) => {
    return {
      id: entry.uuid,
      distance: entry.metadata?.distance,
      properties: {
        document_type: entry.properties.document_type,
        tag: entry.properties.tag,
        document: entry.properties.document,
      },
    };
  });
}
