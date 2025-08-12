"use client";
import { Game } from "@/lib/types";
import clsx from "clsx";
import { GameImage } from "@/components/GameImage";

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
        "nes-container is-rounded p-1 flex items-end overflow-hidden",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="absolute inset-0">
        <GameImage
          game={game}
          width={174}
          height={228}
          className="w-full h-full object-cover image-render-pixel block rounded-md"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      {/* gradient bottom caption */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative w-full px-2 pb-2">
        {/* <div className="text-[12px] font-bold truncate" title={game.title}>
          {game.title}
        </div> */}
        <div className="text-[10px] opacity-80 truncate">
          {game.platform} {game.year ? `· ${game.year}` : ""}
        </div>
      </div>
      {onRemove ? (
        <button
          type="button"
          className="nes-btn is-error !m-0 !px-2 !py-0 absolute top-3 right-3"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="remove"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
