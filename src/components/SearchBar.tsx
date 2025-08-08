"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { GAME_LIBRARY } from "@/lib/games";
import { Game } from "@/lib/types";

type Props = {
  excludeIds?: string[];
  onAdd: (game: Game) => void;
};

export function SearchBar({ excludeIds = [], onAdd }: Props) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(GAME_LIBRARY, {
      keys: ["title", "platform"],
      threshold: 0.3,
    });
  }, []);

  const results = useMemo(() => {
    const pool = GAME_LIBRARY.filter((g) => !excludeIds.includes(g.id));
    if (!query.trim()) return pool.slice(0, 10);
    return fuse
      .search(query)
      .map((r) => r.item)
      .filter((g) => !excludeIds.includes(g.id))
      .slice(0, 10);
  }, [excludeIds, fuse, query]);

  return (
    <div className="flex flex-col gap-2">
      <div className="nes-field">
        <input
          className="nes-input"
          placeholder="搜索游戏..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {results.map((game) => (
          <button
            key={game.id}
            className="nes-btn"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/x-game-id", game.id);
              e.dataTransfer.effectAllowed = "copy";
            }}
            onClick={() => onAdd(game)}
          >
            {game.title} {game.platform ? `(${game.platform})` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
