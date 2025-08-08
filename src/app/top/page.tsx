"use client";
import { useRef } from "react";
import Link from "next/link";
import { useRankingStore, getAllUsedGameIds } from "@/store/useRankingStore";
import { SearchBar } from "@/components/SearchBar";
import { SortableTopList } from "@/components/top/SortableTopList";
import { ExportImageButton } from "@/components/ExportImageButton";

export default function TopPage() {
  const { topMax, setTopMax, addToTop, topGames, clearTop } = useRankingStore();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link className="nes-btn" href="/">返回首页</Link>
          <h2 className="text-xl font-bold">Top 排行</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className={`nes-btn ${topMax === 5 ? "is-primary" : ""}`} onClick={() => setTopMax(5)}>Top 5</button>
          <button className={`nes-btn ${topMax === 10 ? "is-primary" : ""}`} onClick={() => setTopMax(10)}>Top 10</button>
          <button className="nes-btn is-error" onClick={clearTop}>清空</button>
        </div>
      </div>

      <div className="nes-container with-title">
        <p className="title">添加游戏</p>
        <SearchBar excludeIds={getAllUsedGameIds(useRankingStore.getState())} onAdd={addToTop} />
      </div>

      <div className="nes-container with-title">
        <p className="title">当前排名 ({topGames.length}/{topMax})</p>
        <div ref={containerRef} className="space-y-3">
          <SortableTopList />
        </div>
        <div className="mt-4">
          <ExportImageButton targetRef={containerRef} filename={`top-${topMax}.png`} />
        </div>
      </div>
    </div>
  );
}

