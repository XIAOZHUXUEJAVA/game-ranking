"use client";
import { Game } from "@/lib/types";
import clsx from "clsx";

type Props = {
  game: Game;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  // Fixed size required: width 174px, height 228px
};

export function ThumbnailCard({ game, onClick, onRemove, className }: Props) {
  return (
    <div
      className={clsx(
        "relative select-none",
        "w-[174px] h-[228px]",
        "nes-container is-rounded p-0 flex items-end overflow-hidden",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <img
        src="/default-game.svg"
        alt={game.title}
        width={174}
        height={228}
        className="absolute inset-0 w-full h-full object-cover image-render-pixel"
        style={{ imageRendering: "pixelated" }}
      />
      {/* gradient bottom caption */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative w-full px-2 pb-2">
        <div className="text-[12px] font-bold truncate" title={game.title}>
          {game.title}
        </div>
        <div className="text-[10px] opacity-80 truncate">
          {game.platform} {game.year ? `· ${game.year}` : ""}
        </div>
      </div>
      {onRemove ? (
        <button
          className="nes-btn is-error !m-0 !px-2 !py-0 absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
