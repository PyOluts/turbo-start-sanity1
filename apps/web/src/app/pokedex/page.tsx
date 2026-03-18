import Link from "next/link";
import React from "react";

export const revalidate = 86400; // ISR revalidate every 24 hours

export default async function PokedexPage() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151", {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Failed to load Pokedex</h1>
      </div>
    );
  }

  const data = await res.json();
  const pokemon: { name: string; url: string }[] = data.results;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Kanto Pokedex</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pokemon.map((p, index) => {
          const id = index + 1;
          const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
          
          return (
            <Link 
              href={`/pokedex/${p.name}`} 
              key={p.name}
              className="bg-card hover:bg-muted text-card-foreground border border-border transition-colors rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md cursor-pointer"
            >
              <img src={imgUrl} alt={p.name} width={96} height={96} className="pixelated" />
              <h2 className="text-lg font-semibold capitalize mt-2">{p.name}</h2>
              <span className="text-sm text-muted-foreground mt-1 text-opacity-70">
                #{id.toString().padStart(3, "0")}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
