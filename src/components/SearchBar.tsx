"use client";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { GAME_LIBRARY } from "@/lib/games";
import { Game } from "@/lib/types";
import { GameImage } from "@/components/GameImage";

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
    <div className="flex flex-col gap-3">
      <div className="nes-field">
        <input
          className="nes-input"
          placeholder="搜索游戏..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((game) => (
          <div key={game.id} className="justify-self-center">
            <div
              className="cursor-pointer"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/x-game-id", game.id);
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => onAdd(game)}
            >
              <div
                className="text-center text-xs mb-1 truncate"
                title={game.title}
              >
                {game.title}
              </div>
              <div className="w-[200px] h-[228px] nes-container is-rounded !p-0 overflow-hidden">
                <GameImage
                  game={game}
                  width={200}
                  height={228}
                  className="w-full h-full object-cover image-render-pixel block rounded-md"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
