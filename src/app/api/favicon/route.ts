import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  try {
    // 由于 fetch API 不直接支持 timeout 选项，使用 AbortController 来实现超时功能
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return new NextResponse(JSON.stringify({ error: "URL must be a string" }), {
      status: 400,
    });
  }

  try {
    // Try different favicon paths
    const faviconPaths = [
      "/favicon.ico",
      "/favicon.png",
      "/apple-touch-icon.png",
      "/apple-touch-icon-precomposed.png",
    ];

    let imageResponse;
    let faviconUrl;

    for (const path of faviconPaths) {
      try {
        faviconUrl = new URL(path, url);
        imageResponse = await fetchWithRetry(faviconUrl.href);
        const contentType = imageResponse.headers.get("content-type");
        if (imageResponse.ok && contentType && (
          contentType.startsWith("image/") ||
          contentType === "application/octet-stream" // Some servers send icons with this content type
        )) {
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // If no favicon found, return default icon
    if (!imageResponse?.ok) {
      const defaultIconPath = new URL("/public/favicon.ico", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000");
      imageResponse = await fetchWithRetry(defaultIconPath.href);
    }

    const buffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get("content-type") || "image/x-icon";

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch favicon" }),
      { status: 500 }
    );
  }
}
