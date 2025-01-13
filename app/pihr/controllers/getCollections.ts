import { PIHR_RAG } from "@/data/const";
import axios from "axios";

export async function getCollections() {
  const url = `${PIHR_RAG}/api/v1/rag/collections`;    
  const data = await axios.get(url);
  return data.data.entries;
}
