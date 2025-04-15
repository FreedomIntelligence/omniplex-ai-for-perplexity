import { NextRequest, NextResponse } from "next/server";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// export const runtime = "edge";

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

  if (!TAVILY_API_KEY) {
    console.error(
      "Tavily API key is undefined. Please check your .env.local file."
    );
    return new NextResponse(
      JSON.stringify({ message: "Tavily API is not configured properly." }),
      { status: 500 }
    );
  }

  try {
    const { tavily } = require('@tavily/core');
    const client = tavily({ apiKey: TAVILY_API_KEY });
    const tavilyData = await client.search(q.trim(), {
      search_depth: "advanced",
      max_results: 10,
      include_answer: "advanced"
    });
    
    // 将Tavily的返回数据转换为标准格式
    const searchResults = {
      data: {
        webPages: {
          summary: tavilyData.answer || "",
          value: tavilyData.results?.map((item: any) => ({
            name: item.title,
            url: item.url,
            snippet: item.content,
            language: item.language || "en",
            isFamilyFriendly: true,
            displayUrl: item.url
          })) || []
        },
        totalEstimatedMatches: tavilyData.results?.length || 0
      }
    };
    
    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("TAVILY API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}