"use client";
import { useState, useEffect } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaFilter,
} from "react-icons/fa";
import { getFeedbacks } from "../feedbacks_old/getFeedbacks";
import { marked } from "marked";

// Types
interface Feedback {
  id: string;
  is_like: boolean;
  rating: number;
  created_at: string;
  conversation_id: string;
  user_id: string;
  user_message: string;
  ai_message: string;
}

interface FeedbackResponse {
  feedbacks: Feedback[];
  metadata: {
    total: number;
    page_number: number;
    total_pages: number;
    page_size: number;
  };
}

type FilterType = "all" | "liked" | "disliked";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [metadata, setMetadata] = useState<FeedbackResponse["metadata"]>({
    total: 0,
    page_number: 1,
    total_pages: 1,
    page_size: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      let data: FeedbackResponse;

      if (filter === "all") {
        // For 'all', we need to fetch both liked and disliked and combine them
        const likedData = await getFeedbacks(true, currentPage);
        const dislikedData = await getFeedbacks(false, currentPage);

        // Combine and sort by created_at
        const combinedFeedbacks = [
          ...likedData.feedbacks,
          ...dislikedData.feedbacks,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        data = {
          feedbacks: combinedFeedbacks,
          metadata: {
            total: likedData.metadata.total + dislikedData.metadata.total,
            page_number: currentPage,
            total_pages: Math.max(
              likedData.metadata.total_pages,
              dislikedData.metadata.total_pages
            ),
            page_size: likedData.metadata.page_size,
          },
        };
      } else {
        data = await getFeedbacks(filter === "liked", currentPage);
      }

      setFeedbacks(data.feedbacks);
      setMetadata(data.metadata);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filter, currentPage]);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getRatingColor = (rating: number) => {
    if (rating < 1) return "text-gray-600 bg-gray-50 border-gray-200";
    if (rating >= 7) return "text-green-600 bg-green-50 border-green-200";
    if (rating <= 3) return "text-red-600 bg-red-50 border-red-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getRatingBorderColor = (isLike: boolean) => {
    return isLike ? "border-l-green-500" : "border-l-red-500";
  };

  const toggleFeedbackExpansion = (id: string) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const getFeedbacksSubtitle = () => {
    if (filter === "liked") return "Positive Feedback";
    if (filter === "disliked") return "Negative Feedback";
    return "All User Responses";
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Feedback Dashboard
              </h1>
              <p className="text-gray-500 mt-1">{getFeedbacksSubtitle()}</p>
            </div>

            {/* Filter tabs in a dropdown for mobile */}
            <div className="mt-4 md:mt-0">
              <div className="md:hidden dropdown relative">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center space-x-2">
                  <FaFilter />
                  <span>
                    Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                </button>
                <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden">
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    All Feedbacks
                  </button>
                  <button
                    onClick={() => handleFilterChange("liked")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaThumbsUp className="inline mr-2 text-green-500" /> Liked
                  </button>
                  <button
                    onClick={() => handleFilterChange("disliked")}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaThumbsDown className="inline mr-2 text-red-500" />{" "}
                    Disliked
                  </button>
                </div>
              </div>

              {/* Desktop filter tabs */}
              <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-md font-medium transition ${
                    filter === "all"
                      ? "bg-white shadow text-blue-600"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Feedbacks
                </button>
                <button
                  onClick={() => handleFilterChange("liked")}
                  className={`px-4 py-2 rounded-md font-medium transition flex items-center ${
                    filter === "liked"
                      ? "bg-white shadow text-green-600"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaThumbsUp className="mr-2" /> Liked
                </button>
                <button
                  onClick={() => handleFilterChange("disliked")}
                  className={`px-4 py-2 rounded-md font-medium transition flex items-center ${
                    filter === "disliked"
                      ? "bg-white shadow text-red-600"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaThumbsDown className="mr-2" /> Disliked
                </button>
              </div>
            </div>
          </div>

          {/* Stats summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Feedbacks
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {metadata.total}
                  </p>
                </div>
                <div className="bg-blue-500 rounded-full p-3">
                  <FaComment className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-sm border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">
                    Current Page
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {metadata.page_number}{" "}
                    <span className="text-lg text-gray-500">
                      / {metadata.total_pages}
                    </span>
                  </p>
                </div>
                <div className="bg-green-500 rounded-full p-3">
                  <FaThumbsUp className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-sm border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">
                    Items Per Page
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {metadata.page_size}
                  </p>
                </div>
                <div className="bg-purple-500 rounded-full p-3">
                  <FaFilter className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback list */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-gray-400 mx-auto w-16 h-16 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-xl font-medium">
                No feedbacks found for the selected filter.
              </p>
              <p className="text-gray-400 mt-2">
                Try selecting a different filter or check back later.
              </p>
            </div>
          ) : (
            feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition border-l-4 overflow-hidden ${getRatingBorderColor(
                  feedback.is_like
                )}`}
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                        ID:{" "}
                        {typeof feedback?.user_id === "string"
                          ? feedback?.user_id?.substring(0, 8)
                          : "N/A"}
                      </span>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        {formatDate(feedback.created_at)}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full flex items-center border ${getRatingColor(
                        feedback.rating
                      )}`}
                    >
                      {feedback.is_like ? (
                        <FaThumbsUp className="text-green-600 mr-2" />
                      ) : (
                        <FaThumbsDown className="text-red-600 mr-2" />
                      )}
                      <span className="font-medium">
                        {feedback.rating > 0
                          ? `Rating: ${feedback.rating}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          ></path>
                        </svg>
                        User Question
                      </h3>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {expandedFeedback === feedback.id
                          ? feedback.user_message
                          : truncateText(feedback.user_message)}
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          ></path>
                        </svg>
                        AI Response
                      </h3>
                      {expandedFeedback === feedback.id ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked(feedback.ai_message),
                          }}
                          className="markdown"
                        ></div>
                      ) : (
                        <p className="text-gray-800 whitespace-pre-wrap">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: marked(truncateText(feedback.ai_message)),
                            }}
                            className="markdown"
                          ></div>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex-grow"></div>
                    <button
                      onClick={() => toggleFeedbackExpansion(feedback.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      {expandedFeedback === feedback.id
                        ? "Show Less"
                        : "Show More"}
                      <svg
                        className={`w-4 h-4 ml-1 transition-transform ${
                          expandedFeedback === feedback.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      View Full Conversation
                      <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                    </button> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {metadata.total_pages > 1 && (
          <div className="flex justify-center mt-10 mb-8">
            <nav className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>

              {Array.from(
                { length: metadata.total_pages },
                (_, i) => i + 1
              ).map((page) => {
                // Show limited page numbers with ellipsis
                if (
                  page === 1 ||
                  page === metadata.total_pages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-blue-600 border-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 &&
                    currentPage < metadata.total_pages - 2)
                ) {
                  return (
                    <span
                      key={page}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(metadata.total_pages, currentPage + 1)
                  )
                }
                disabled={currentPage === metadata.total_pages}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === metadata.total_pages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
