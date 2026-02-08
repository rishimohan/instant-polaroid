import { NextResponse } from "next/server";
import { headers } from "next/headers";

const ORSHOT_API_URL = "https://api.orshot.com/v1/studio/render";
const ORSHOT_API_KEY = process.env.ORSHOT_API_KEY;
const ORSHOT_TEMPLATE_ID =
  process.env.ORSHOT_TEMPLATE_ID || "PLACEHOLDER_TEMPLATE_ID";

// Simple in-memory rate limiter
const rateLimit = new Map();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, data] of rateLimit.entries()) {
      if (now > data.resetTime) {
        rateLimit.delete(ip);
      }
    }
  },
  5 * 60 * 1000,
);

export async function POST(request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const limitData = rateLimit.get(ip) || {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
    };

    if (now > limitData.resetTime) {
      limitData.count = 0;
      limitData.resetTime = now + RATE_LIMIT_WINDOW;
    }

    if (limitData.count >= MAX_REQUESTS) {
      return NextResponse.json(
        {
          error:
            "You can only make 5 requests per minute. Please try again later.",
        },
        { status: 429 },
      );
    }

    limitData.count++;
    rateLimit.set(ip, limitData);

    const { imageUrl, caption, backgroundColor, captionColor } =
      await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL or base64 data is required" },
        { status: 400 },
      );
    }

    if (!ORSHOT_API_KEY || ORSHOT_API_KEY === "your_orshot_api_key_here") {
      return NextResponse.json(
        { error: "Orshot API key is not configured" },
        { status: 500 },
      );
    }

    if (
      !ORSHOT_TEMPLATE_ID ||
      ORSHOT_TEMPLATE_ID === "PLACEHOLDER_TEMPLATE_ID"
    ) {
      return NextResponse.json(
        { error: "Orshot template ID is not configured" },
        { status: 500 },
      );
    }

    const sanitizedCaption = caption ? String(caption).slice(0, 60) : undefined;

    const modifications = {
      photo: imageUrl,
      ...(sanitizedCaption && { caption: sanitizedCaption }),
      ...(captionColor && { "caption.color": captionColor }),
    };

    // canvasBackgroundColor is a top-level style parameter, not inside modifications
    if (backgroundColor) {
      modifications["canvasBackgroundColor"] = backgroundColor;
    }

    const response = await fetch(ORSHOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ORSHOT_API_KEY}`,
      },
      body: JSON.stringify({
        templateId: Number(ORSHOT_TEMPLATE_ID),
        modifications,
        response: {
          type: "url",
          format: "png",
          scale: 3,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Orshot API error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to generate polaroid" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      image: data.data.content,
      format: data.data.format,
    });
  } catch (error) {
    console.error("Polaroid generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
