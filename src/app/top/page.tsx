"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRankingStore, getTopGameIds } from "@/store/useRankingStore";
import { SearchBar } from "@/components/SearchBar";
import { SortableTopList } from "@/components/top/SortableTopList";
import { ExportImageButton } from "@/components/ExportImageButton";

export default function TopPage() {
  const { topMax, setTopMax, addToTop, topGames, clearTop } = useRankingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [exportTitle, setExportTitle] = useState(
    `我心目中的 Top${topMax} 游戏`
  );

  useEffect(() => {
    if (/^我心目中的 Top\d+ 游戏$/.test(exportTitle)) {
      setExportTitle(`我心目中的 Top${topMax} 游戏`);
    }
  }, [topMax, exportTitle]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="nes-container is-dark pixel-shadow pixel-rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link className="nes-btn pixel-rounded" href="/">
              返回首页
            </Link>
            <h2 className="text-xl font-bold">游戏排行</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`nes-btn pixel-rounded ${
                topMax === 5 ? "is-primary" : ""
              }`}
              onClick={() => setTopMax(5)}
            >
              Top 5
            </button>
            <button
              className={`nes-btn pixel-rounded ${
                topMax === 10 ? "is-primary" : ""
              }`}
              onClick={() => setTopMax(10)}
            >
              Top 10
            </button>
            <button
              className="nes-btn is-error pixel-rounded"
              onClick={clearTop}
            >
              清空
            </button>
          </div>
        </div>
        {/* <div className="mt-3 flex items-center gap-3">
          <span className="nes-badge">
            <span className="is-dark">
              {topGames.length}/{topMax}
            </span>
          </span>
          <progress
            className="nes-progress is-pattern flex-1 pixel-rounded"
            value={topGames.length}
            max={topMax}
          />
        </div> */}
        <div className="mt-3 relative">
          <span className="nes-badge absolute -top-1 left-0">
            <span className="is-dark">
              {topGames.length}/{topMax}
            </span>
          </span>
          <progress
            className="nes-progress is-pattern flex-1 pixel-rounded"
            value={topGames.length}
            max={topMax}
          />
          {/* 马里奥图标 */}
          <i
            className="nes-mario nes-icon is-small absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${(topGames.length / topMax) * 100}%`,
              transform: "translateX(-50%) translateY(-50%)",
              transition: "left 0.3s ease",
            }}
          ></i>
        </div>
      </div>

      {/* <div className="nes-container with-title pixel-shadow mt-4">
        <p className="title">添加游戏</p>
        <SearchBar
          excludeIds={getTopGameIds(useRankingStore.getState())}
          onAdd={addToTop}
        />
      </div> */}
      <div className="nes-container with-title pixel-shadow mt-4 pixel-rounded">
        <p className="title">添加游戏</p>
        <SearchBar
          excludeIds={getTopGameIds(useRankingStore.getState())}
          onAdd={addToTop}
        />
      </div>

      <div className="nes-container with-title pixel-rounded">
        <p className="title">
          当前排名 ({topGames.length}/{topMax})
        </p>
        <div className="nes-field mb-3">
          <label>导出标题</label>
          <input
            className="nes-input"
            value={exportTitle}
            onChange={(e) => setExportTitle(e.target.value)}
            placeholder={`我心目中的 Top${topMax} 游戏`}
          />
        </div>
        <div ref={containerRef} className="space-y-3">
          <h3 className="text-center text-base font-bold retro-title">
            {exportTitle}
          </h3>
          <SortableTopList />
        </div>
        <div className="mt-4 print:hidden">
          <ExportImageButton
            targetRef={containerRef}
            filename={`top-${topMax}.png`}
          />
        </div>
      </div>
    </div>
  );
}
