"use client";
import { toPng } from "html-to-image";
import { useState } from "react";

type ElementLikeRef = { current: HTMLElement | null };

type Props = {
  targetRef: ElementLikeRef;
  filename?: string;
};

export function ExportImageButton({
  targetRef,
  filename = "ranking.png",
}: Props) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      // 强制重新渲染DOM以确保内容更新
      const timestamp = Date.now();
      targetRef.current.setAttribute('data-export-timestamp', timestamp.toString());
      
      // 强制触发重排和重绘
      targetRef.current.style.transform = 'translateZ(0)';
      targetRef.current.offsetHeight; // 强制重排
      
      // 等待更长时间确保DOM完全更新
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 重置transform
      targetRef.current.style.transform = '';
      
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipAutoScale: true,
        includeQueryParams: true,
        backgroundColor:
          getComputedStyle(document.body).backgroundColor || "#ffffff",
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (node.getAttribute("aria-label") === "remove") return false;
          }
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="nes-btn is-primary"
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? "导出中..." : "导出为图片"}
    </button>
  );
}