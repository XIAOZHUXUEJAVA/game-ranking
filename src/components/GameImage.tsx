"use client";
import Image from "next/image";
import { useMemo, useState, ImgHTMLAttributes } from "react";
import { Game } from "@/lib/types";

type Props = {
  game: Game;
  extensions?: string[];
} & Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "className" | "width" | "height" | "alt" | "style" | "loading"
>;

function hashToHsl(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  const sat = 65;
  const light = 58;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export function GameImage({
  game,
  extensions,
  className,
  width,
  height,
  alt,
  style,
  loading = "lazy",
}: Props) {
  const candidates = useMemo(() => {
    const base = `/covers/${game.id}`;
    const exts = extensions ?? ["jpg", "png"];
    return exts.map((ext) => `${base}.${ext}`);
  }, [game.id, extensions]);

  const [srcIndex, setSrcIndex] = useState(0);

  const hasMoreCandidates = srcIndex < candidates.length;
  const src = hasMoreCandidates ? candidates[srcIndex] : "/default-game.svg";

  // If we've exhausted all candidates and still can't load, render a distinct pixel fallback per game
  if (!hasMoreCandidates && srcIndex >= candidates.length) {
    const color = hashToHsl(game.id);
    const initials = (game.title || "?").slice(0, 2).toUpperCase();
    return (
      <div
        className={className}
        style={{
          width,
          height,
          ...style,
          background:
            `linear-gradient(${color}, ${color}),` +
            `repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 2px),` +
            `repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 2px)`,
          imageRendering: "pixelated",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
        aria-label={alt ?? game.title}
      >
        <span
          style={{
            fontFamily: "var(--font-press-start), Zpix, monospace",
            fontSize: 12,
            color: "rgba(0,0,0,0.85)",
            textShadow: "0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt ?? game.title}
      width={Number(width)}
      height={Number(height)}
      className={className}
      style={style}
      loading={loading}
      onError={() => setSrcIndex((i) => i + 1)}
      priority={false}
    />
  );
}
