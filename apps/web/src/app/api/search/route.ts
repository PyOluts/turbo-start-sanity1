import { Client } from "@opensearch-project/opensearch";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let osResults: any[] = [];
    const osUrl = process.env.OPENSEARCH_URL;
    
    if (osUrl) {
      try {
        const opensearch = new Client({ node: osUrl });
        const { body } = await opensearch.search({
          index: process.env.OPENSEARCH_INDEX_NAME || "turbo-search",
          body: {
            query: {
              multi_match: {
                query,
                fields: ["title^3", "description", "pokemon"],
                fuzziness: "AUTO",
              },
            },
          },
        });

        osResults = body.hits.hits.map((hit: any) => hit._source);
      } catch (osError) {
        console.warn("OpenSearch fetch failed (graceful degradation):", osError);
      }
    } else {
      console.warn("OPENSEARCH_URL not configured. Search returning local results only.");
    }

    // Unified Search: Combine with PokeAPI results directly
    let pokemonResults: any[] = [];
    try {
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
      if (pokeRes.ok) {
        const p = await pokeRes.json();
        pokemonResults.push({
          type: "pokemon",
          title: Object.keys(p.species || {}).length ? p.species.name : p.name,
          slug: `/pokedex/${p.name}`,
          description: `Pokemon ID: ${p.id}, Types: ${p.types.map((t: any) => t.type.name).join(', ')}`,
          image: p.sprites?.front_default
        });
      }
    } catch (pokeError) {
      console.warn("PokeAPI fetch failed:", pokeError);
    }

    return NextResponse.json([...osResults, ...pokemonResults]);

  } catch (error) {
    console.error("Search API generic error:", error);
    return NextResponse.json([]); // Graceful degradation, empty array instead of 500 crash
  }
}
