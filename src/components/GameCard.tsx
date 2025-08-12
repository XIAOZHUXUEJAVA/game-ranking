"use client";
import { Game } from "@/lib/types";
import clsx from "clsx";
import { GameImage } from "@/components/GameImage";

type Props = {
  game: Game;
  onRemove?: (id: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function GameCard({ game, onRemove, className, size = "lg" }: Props) {
  const imgPx = size === "lg" ? 112 : size === "sm" ? 56 : 80;
  const imgClass =
    size === "lg" ? "w-28 h-28" : size === "sm" ? "w-14 h-14" : "w-20 h-20";
  return (
    <div
      className={clsx(
        "flex items-center justify-between gap-4 nes-container is-rounded p-2 md:p-3",
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <GameImage
          game={game}
          width={imgPx}
          height={imgPx}
          className={clsx(
            imgClass,
            "block rounded-sm object-cover image-render-pixel border border-black/40 shrink-0"
          )}
          style={{ imageRendering: "pixelated" }}
        />
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-base md:text-lg truncate">
            {game.title}
          </span>
          <span className="text-xs md:text-sm opacity-70 truncate">
            {game.platform} {game.year ? `· ${game.year}` : ""}
          </span>
        </div>
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
