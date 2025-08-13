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
    const exts = extensions ?? ["png"];
    return exts.map((ext) => `${base}.${ext}`);
  }, [game.id, extensions]);

  const [srcIndex, setSrcIndex] = useState(0);

  const src =
    srcIndex < candidates.length ? candidates[srcIndex] : "/default-game.svg";

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
