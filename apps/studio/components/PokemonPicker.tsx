import { Card, Select, Spinner, Stack } from "@sanity/ui";
import React, { useEffect, useState } from "react";
import { StringInputProps, set, unset } from "sanity";

export function PokemonPicker(props: StringInputProps) {
  const { value, onChange } = props;
  const [pokemon, setPokemon] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
      .then(res => res.json())
      .then(data => {
        setPokemon(data.results);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    onChange(val ? set(val) : unset());
  };

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
