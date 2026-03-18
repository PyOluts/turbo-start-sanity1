import { Client } from "@opensearch-project/opensearch";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body._id) {
      return NextResponse.json({ error: "No _id in payload" }, { status: 400 });
    }
    
    // We only initialize OpenSearch if it's available, otherwise log and degrade gracefully
    const osUrl = process.env.OPENSEARCH_URL;
    if (!osUrl) {
      console.warn("OPENSEARCH_URL is not set, skipping OpenSearch indexing.");
      return NextResponse.json({ success: true, skipped: true });
    }

    const opensearch = new Client({
      node: osUrl,
    });

    const doc = {
      id: body._id,
      title: body.title,
      description: body.description,
      slug: body.slug?.current || body.slug,
      type: body._type,
      pokemon: body.pokemon,
    };

    await opensearch.index({
      index: process.env.OPENSEARCH_INDEX_NAME || "turbo-search",
      id: doc.id,
      body: doc,
      refresh: true,
    });

    return NextResponse.json({ success: true, doc });
  } catch (error) {
    console.error("Reindex error:", error);
    return NextResponse.json({ error: "Failed to reindex" }, { status: 500 });
  }
}
