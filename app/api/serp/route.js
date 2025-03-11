export async function GET(request) {
  const apiUrl = `https://serpapi.com/search.json?q=Invisalign+Dentist+South+Bend&location=South+Bend,IN&hl=en&gl=us&api_key=${process.env.NEXT_PUBLIC_SERP_API_KEY}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return Response.json(data); // ✅ Correct response format
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response("Failed to fetch SERP API", { status: 500 });
  }
}
