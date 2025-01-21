"use client";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "../[collection_name]/Paginaton";
import React, { useEffect } from "react";
import { getFeedbacks } from "./getFeedbacks";
import { Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const isLiked = searchParams.get("is_liked") || "true";
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalFeedbacks, setTotalFeedbacks] = React.useState(0);
  const [feedbacks, setFeedbacks] = React.useState<
    {
      id: string;
      is_liked: boolean;
      rating: number;
      conversation_id: string;
      user_message: string;
      ai_message: string;
    }[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    getFeedbacks(isLiked === "true", Number(page)).then((res) => {
      setFeedbacks(
        res?.feedbacks?.map(
          (f: {
            id: string;
            is_like: boolean;
            rating: number;
            conversation_id: string;
            user_message: string;
            ai_message: string;
          }) => ({
            id: f.id,
            is_liked: f.is_like,
            rating: f.rating,
            conversation_id: f.conversation_id,
            user_message: f.user_message,
            ai_message: f.ai_message,
          })
        ) || []
      );
      setTotalPages(res?.metadata?.total_pages || 1);
      setTotalFeedbacks(res?.metadata?.total || 0);
      setIsLoading(false);
    });
  }, [page, isLiked]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen overflow-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Feedback ({isLiked === "true" ? "Positive" : "Negative"})
        </h1>
        <p className="text-sm text-gray-500">
          Total: {totalFeedbacks} feedback{totalFeedbacks !== 1 ? "s" : ""}
        </p>
      </div>

      {feedbacks.length === 0 ? (
        <div className="w-full p-12 flex flex-col items-center justify-center text-gray-500">
          <p>No feedback found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="border rounded-lg p-4 space-y-4 bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      feedback.is_liked === true
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {feedback.is_liked === true ? "Positive" : "Negative"}
                  </span>
                  <span className="text-sm text-gray-500">
                    Rating: {feedback.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ID: {feedback.conversation_id}
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">User Message:</p>
                  <p className="text-sm">{feedback.user_message}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">AI Response:</p>
                  <p className="text-sm">{feedback.ai_message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <PaginationComponent page={Number(page)} totalPages={totalPages} />
      </div>
    </div>
  );
}
