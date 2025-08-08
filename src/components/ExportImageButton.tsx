"use client";
import { toPng } from "html-to-image";
import { RefObject, useState } from "react";

type Props = {
  targetRef: RefObject<HTMLElement>;
  filename?: string;
};

export function ExportImageButton({ targetRef, filename = "ranking.png" }: Props) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor || "#ffffff",
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
    <button className="nes-btn is-primary" onClick={handleExport} disabled={loading}>
      {loading ? "导出中..." : "导出为图片"}
    </button>
  );
}

