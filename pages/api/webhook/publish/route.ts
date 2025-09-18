import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface ContentfulWebhookPayload {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields?: {
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const payload: ContentfulWebhookPayload = await request.json();
    console.log("Received webhook payload:", payload);
    if (payload.sys.type === "Entry") {
      revalidateTag("tags");

      return NextResponse.json({
        message: "Webhook received and cache invalidated",
        entry: {
          id: payload.sys.id,
          revision: payload.sys.revision,
          updatedAt: payload.sys.updatedAt,
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        message: "Webhook received but no action taken",
        type: payload.sys.type,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Contentful webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
