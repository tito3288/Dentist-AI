"use client";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";

export default function Dashboard() {
  const [competitors, setCompetitors] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetitorData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/serp"); // ✅ Now calling the Next.js backend API

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // ✅ Debug response

      if (data.organic_results) {
        setCompetitors(data.organic_results);
      }

      if (data.ads) {
        setAds(data.ads);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCompetitorData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Competitor List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Top Competitors</h2>
        <ul className="list-disc ml-6">
          {competitors.map((competitor, index) => (
            <li key={index} className="mt-2">
              <a
                href={competitor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {competitor.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Ads Data */}
      <div>
        <h2 className="text-xl font-semibold">Who’s Running Google Ads?</h2>
        <ul className="list-disc ml-6">
          {ads.map((ad, index) => (
            <li key={index} className="mt-2">
              <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {ad.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
