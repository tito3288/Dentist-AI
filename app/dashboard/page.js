"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// ✅ Function to extract and format the domain name from a URL
const extractDomainName = (url) => {
  try {
    const hostname = new URL(url).hostname; // Extract hostname (e.g., "olathesmilesdentistry.com")
    let name = hostname.replace("www.", "").split(".")[0]; // Remove "www." and extract core name

    // ✅ Convert kebab-case, snake_case, and camelCase to readable format
    name = name.replace(/[-_]/g, " "); // Replace hyphens and underscores with spaces
    name = name.replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space before capital letters (camelCase fix)

    // ✅ Capitalize each word properly
    name = name
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join back into a string

    return name;
  } catch {
    return "Unknown Competitor"; // Fallback in case of error
  }
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // ✅ Wait for authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setError("User not logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch competitor data *only* when userData is available
  useEffect(() => {
    if (user && userData) {
      fetchCompetitorData(user.uid);
    }
  }, [user, userData]);

  const fetchCompetitorData = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/serp?userId=${userId}`);
      const data = await response.json();

      console.log("🔍 API Response:", data);

      if (data.organic_results) {
        setCompetitors(data.organic_results);
      } else {
        console.warn("No competitors found.");
      }

      if (data.ads) {
        setAds(data.ads);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Failed to fetch data.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Competitor List */}
      {userData && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold">
              Top Competitors in {userData.city}
            </h2>
            <ul className="list-disc ml-6">
              {competitors.length > 0 ? (
                competitors.map((competitor, index) => (
                  <li key={index} className="mt-2">
                    <span className="font-semibold">
                      {extractDomainName(competitor.link)}
                    </span>{" "}
                    -
                    <a
                      href={competitor.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline ml-1"
                    >
                      {competitor.title}
                    </a>
                  </li>
                ))
              ) : (
                <p>No competitors found.</p>
              )}
            </ul>
          </div>

          {/* Google Ads Data */}
          <div>
            <h2 className="text-xl font-semibold">Who’s Running Google Ads?</h2>
            <ul className="list-disc ml-6">
              {ads.length > 0 ? (
                ads.map((ad, index) => (
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
                ))
              ) : (
                <p>No ads found.</p>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
