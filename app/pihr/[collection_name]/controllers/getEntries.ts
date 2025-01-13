import { PAGE_SIZE, PIHR_RAG } from "@/data/const";
import axios from "axios";

export async function getEntries(
  collection_name: string,
  page: number
): Promise<
  {
    id: string;
    properties: {
      document_type: string;
      tag: string[];
      document: string;
    };
  }[]
> {
  const url = `${PIHR_RAG}/api/v1/rag/entries/${collection_name}?limit=${PAGE_SIZE}&page=${page}`;
  const data = await axios.get(url);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.data.entries.map((entry: any) => {
    return {
      id: entry.uuid,
      properties: {
        document_type: entry.properties.document_type,
        tag: entry.properties.tag,
        document: entry.properties.document,
      },
    };
  });
}
