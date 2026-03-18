import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";

export const revalidate = 86400; // ISR revalidate every 24 hours

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Failed to load Pokemon: {name}</h1>
      </div>
    );
  }

  const pokemon: any = await res.json();
  const title = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const imgUrl = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

  return (
    <div className="container mx-auto py-10 max-w-4xl px-4">
      <Link href="/pokedex" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        ← Back to Pokedex
      </Link>
      
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-8">
        <div className="w-full md:w-1/3 flex justify-center bg-muted/50 rounded-xl p-6">
          <img src={imgUrl} alt={pokemon.name} width={256} height={256} className="drop-shadow-xl" />
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">{title}</h1>
            <span className="text-xl font-medium text-muted-foreground">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>
          
          <div className="flex gap-2 mb-8">
            {pokemon.types.map((t: any) => (
              <span 
                key={t.type.name} 
                className="px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20"
              >
                {t.type.name}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Height</p>
              <p className="text-lg font-semibold">{pokemon.height / 10} m</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <p className="text-lg font-semibold">{pokemon.weight / 10} kg</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 border-b pb-2">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((s: any) => (
                <div key={s.stat.name} className="flex items-center text-sm">
                  <span className="w-32 font-medium capitalize flex-shrink-0 text-muted-foreground">
                    {s.stat.name.replace("-", " ")}
                  </span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 mx-4 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${s.base_stat > 100 ? 'bg-green-500' : s.base_stat > 60 ? 'bg-primary' : 'bg-destructive'}`} 
                      style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }} 
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-foreground">{s.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
