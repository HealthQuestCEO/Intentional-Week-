import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers }
      );
    }

    const store = getStore("user-data");

    // GET - Retrieve user data
    if (req.method === "GET") {
      const data = await store.get(userId, { type: "json" });
      return new Response(
        JSON.stringify({ data: data || null }),
        { status: 200, headers }
      );
    }

    // POST - Save user data
    if (req.method === "POST") {
      const body = await req.json();
      await store.setJSON(userId, body.data);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    }

    // DELETE - Remove user data
    if (req.method === "DELETE") {
      await store.delete(userId);
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    );

  } catch (error) {
    console.error("Blob error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: "/api/blob",
};
