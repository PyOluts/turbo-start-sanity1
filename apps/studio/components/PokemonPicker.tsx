import { Card, Select, Spinner, Stack } from "@sanity/ui";
import React, { useEffect, useState } from "react";
import { StringInputProps, set, unset } from "sanity";

export function PokemonPicker(props: StringInputProps) {
  const { value, onChange } = props;
  const [pokemon, setPokemon] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
        .then(res => res.json())
        .then(data => {
          if (data && data.results) {
            setPokemon(data.results);
          } else {
            setError(true);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Pokemon fetch error:", err);
          setError(true);
          setLoading(false);
        });
    } catch (err) {
      console.error("Unexpected error in PokemonPicker:", err);
      setError(true);
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    onChange(val ? set(val) : unset());
  };

  if (error) {
    // If the PokeAPI fetch fails, gracefully return a standard Sanity string input
    return props.renderDefault(props);
  }

  return (
    <Stack space={3}>
      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <Select value={value} onChange={handleChange}>
            <option value="">Select a Pokemon</option>
            {pokemon.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
              </option>
            ))}
          </Select>
        )}
      </Card>
    </Stack>
  );
}
