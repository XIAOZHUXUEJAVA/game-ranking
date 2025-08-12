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
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
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
