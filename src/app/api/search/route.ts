import { NextRequest, NextResponse } from "next/server";

const CUSTOM_SEARCH_JSON_API = process.env.CUSTOM_SEARCH_JSON_API;
const GOOGLE_CX = process.env.GOOGLE_CX;
const GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || typeof q !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "q" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!CUSTOM_SEARCH_JSON_API||!GOOGLE_CX) {
    console.error(
      "Bing API key is undefined. Please check your .env.local file."
    );
    return new NextResponse(
      JSON.stringify({ message: "Bing API key is not configured." }),
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${GOOGLE_SEARCH_URL}?q=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: new Headers({
          "Ocp-Apim-Subscription-Key": CUSTOM_SEARCH_JSON_API,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ message: "Success", data });
  } catch (error) {
    console.error("GOOGLE API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}