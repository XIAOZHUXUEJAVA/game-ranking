"use client";
import { Game } from "@/lib/types";
import clsx from "clsx";

type Props = {
  game: Game;
  onRemove?: (id: string) => void;
  className?: string;
};

export function GameCard({ game, onRemove, className }: Props) {
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-3 nes-container is-rounded p-3",
        className
      )}
    >
      <div className="flex flex-col">
        <span className="font-bold text-sm">{game.title}</span>
        <span className="text-xs opacity-70">
          {game.platform} {game.year ? `· ${game.year}` : ""}
        </span>
      </div>
      {onRemove ? (
        <button
          type="button"
          className="nes-btn is-error !m-0 !px-2 !py-1"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(game.id);
          }}
          aria-label="remove"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
