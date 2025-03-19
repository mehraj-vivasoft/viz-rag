import { PIHR_RAG } from "@/data/const";
import axios from "axios";

export async function getFeedbacks(is_liked: boolean, page: number) {
    const url = `${PIHR_RAG}/api/v1/messages/feedbacks?is_liked=${is_liked}&page_number=${page}&page_size=10`;
    const data = await axios.get(url);
    return data.data;
}