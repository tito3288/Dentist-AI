import { db } from "@/lib/firebase"; // Import Firestore
import { doc, getDoc } from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId"); // Get user ID from request

  if (!userId) {
    return new Response("Missing user ID", { status: 400 });
  }

  try {
    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return new Response("User not found", { status: 404 });
    }

    const userData = userDoc.data();
    const city = userData.city || "South Bend";
    const services = userData.services || ["Dentist"]; // Default to "Dentist" if empty

    // Generate query based on services
    const query = `${services[0]} Dentist ${city}`; // Uses first service dynamically

    const apiUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(city)}&hl=en&gl=us&api_key=${
      process.env.NEXT_PUBLIC_SERP_API_KEY
    }`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log("SERP API Response:", data);
    return Response.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response("Failed to fetch SERP API", { status: 500 });
  }
}
