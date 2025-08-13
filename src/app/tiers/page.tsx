"use client";
import { useRef } from "react";
import Link from "next/link";
import { useRankingStore, getTierGameIds } from "@/store/useRankingStore";
import { SearchBar } from "@/components/SearchBar";
import { TierBoard } from "@/components/tiers/TierBoard";
import { ExportImageButton } from "@/components/ExportImageButton";

export default function TiersPage() {
  const { addToTier, clearTiers } = useRankingStore();
  const boardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="nes-container is-dark pixel-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link className="nes-btn" href="/">
              返回首页
            </Link>
            <h2 className="text-xl font-bold">梯队划分</h2>
          </div>
          <button className="nes-btn is-error" onClick={clearTiers}>
            清空
          </button>
        </div>
        <div className="mt-3 text-xs opacity-80">
          提示：左右分栏展示；右侧搜索结果可拖入左侧任意梯队或其卡片之间。
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <div className="lg:col-span-8 space-y-4">
          <div
            ref={boardRef as React.RefObject<HTMLDivElement>}
            className="space-y-4"
          >
            <TierBoard />
          </div>
          <div className="print:hidden">
            <ExportImageButton targetRef={boardRef} filename="tiers.png" />
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="nes-container with-title pixel-shadow">
            <p className="title">添加到某个梯队</p>
            <SearchBar
              gridColumns="two"
              excludeIds={getTierGameIds(useRankingStore.getState())}
              onAdd={(g) => addToTier("T3", g)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
