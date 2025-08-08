"use client";
import { useRef } from "react";
import Link from "next/link";
import { useRankingStore, getAllUsedGameIds } from "@/store/useRankingStore";
import { SearchBar } from "@/components/SearchBar";
import { TierBoard } from "@/components/tiers/TierBoard";
import { ExportImageButton } from "@/components/ExportImageButton";

export default function TiersPage() {
  const { addToTier, clearTiers } = useRankingStore();
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link className="nes-btn" href="/">返回首页</Link>
          <h2 className="text-xl font-bold">梯队划分</h2>
        </div>
        <button className="nes-btn is-error" onClick={clearTiers}>清空</button>
      </div>

      <div className="nes-container with-title">
        <p className="title">添加到某个梯队</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SearchBar
            excludeIds={getAllUsedGameIds(useRankingStore.getState())}
            onAdd={(g) => addToTier("T3", g)}
          />
          <div className="text-xs opacity-70 flex items-center">提示：点击搜索结果添加，默认添加到 T3，稍后你可以拖拽到其它梯队并调整顺序。</div>
        </div>
      </div>

      <div ref={boardRef} className="space-y-4">
        <TierBoard />
      </div>

      <ExportImageButton targetRef={boardRef} filename="tiers.png" />
    </div>
  );
}

