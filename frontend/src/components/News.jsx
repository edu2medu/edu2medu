import { useState, useEffect } from "react";
import { deduplicatedGet } from "../utils/apiClient";
import { getCachedData, setCachedData } from "../utils/apiCache";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      const cacheKey = 'all-news';
      const cachedData = getCachedData(cacheKey);
      
      try {
        let response;
        if (cachedData) {
          // Use cached data for instant display
          response = { data: cachedData };
          setLoading(false);
        } else {
          response = await deduplicatedGet(`${import.meta.env.VITE_BASEURI}/admin/getallNews`);
          setCachedData(cacheKey, response.data);
        }
        
        setNewsList(response.data.news);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-700">Loading news...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-6xl mt-27 mx-auto py-12">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
        Latest <span className="text-[#17A2B8]">News</span>
      </h1>

      {selectedNews ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img
            src={selectedNews.image ? `${import.meta.env.VITE_BASEURI}/${selectedNews.image}` : "/default-image.png"}
            alt="News"
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => (e.target.src = "/default-image.png")}
          />
          <h2 className="text-2xl font-bold mt-4">{selectedNews.title}</h2>
          <p className="text-gray-700 mt-2">{selectedNews.content}</p>
          {selectedNews.moreContent && (
            <p className="text-gray-600 mt-4">{selectedNews.moreContent}</p>
          )}
          <button
            onClick={() => setSelectedNews(null)}
            className="mt-4 text-[#17A2B8] hover:underline font-medium"
          >
            Back
          </button>
        </div>
      ) : (
        <>
          {newsList.length > 0 && (
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden mb-12">
              <img
                src={newsList[0].image ? `${import.meta.env.VITE_BASEURI}/${newsList[0].image}` : "/default-image.png"}
                alt="Featured News"
                className="w-full h-64 object-cover"
                onError={(e) => (e.target.src = "/default-image.png")}
              />
              <div className="absolute inset-0 bg-opacity-50 flex flex-col justify-end p-6">
                <h2 className="text-white text-2xl font-bold">{newsList[0].title}</h2>
                <p className="text-gray-200 mt-2">{newsList[0].content.substring(0, 100)}...</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {newsList.slice(1).map((news) => (
              <div
                key={news._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={news.image}
                  alt="News"
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "/default-image.png")}
                />
                <h3 className="text-xl font-semibold mt-4 text-gray-900">{news.title}</h3>
                <p className="text-gray-600 mt-2">{news.content.substring(0, 100)}...</p>
                <button
                  onClick={() => setSelectedNews(news)}
                  className="mt-4 text-[#17A2B8] hover:underline font-medium"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default News;
