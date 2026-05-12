import { NextResponse } from "next/server";
import { getRankingsPayload, RANKINGS_REVALIDATE_SECONDS } from "@/lib/data/rankings";

export const revalidate = 86400;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const forceFresh = url.searchParams.get("refresh") === "1";
    const sourceSelection = {
      chat: url.searchParams.get("src_chat") ?? undefined,
      local: url.searchParams.get("src_local") ?? undefined,
      image: url.searchParams.get("src_image") ?? undefined,
      video: url.searchParams.get("src_video") ?? undefined,
      audio: url.searchParams.get("src_audio") ?? undefined,
    };
    const payload = await getRankingsPayload({ forceFresh, sourceSelection });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": forceFresh
          ? "no-store"
          : `public, s-maxage=${RANKINGS_REVALIDATE_SECONDS}, stale-while-revalidate=600`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to build rankings",
        detail: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 }
    );
  }
}
