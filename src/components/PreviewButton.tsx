"use client";
import { toPng } from "html-to-image";
import { useState } from "react";

type ElementLikeRef = { current: HTMLElement | null };

type Props = {
  targetRef: ElementLikeRef;
};

export function PreviewButton({ targetRef }: Props) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    if (!targetRef.current) return;
    setLoading(true);
    try {
      // 强制重新渲染DOM以确保内容更新
      const timestamp = Date.now();
      targetRef.current.setAttribute('data-preview-timestamp', timestamp.toString());
      
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
            // 隐藏添加游戏按钮
            if (node.classList.contains("print:hidden")) return false;
            // 检查父元素是否有 print:hidden 类
            let parent = node.parentElement;
            while (parent) {
              if (parent.classList.contains("print:hidden")) return false;
              parent = parent.parentElement;
            }
          }
          return true;
        },
      });
      
      setPreviewUrl(dataUrl);
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <>
      <button
        className="nes-btn"
        onClick={handlePreview}
        disabled={loading}
      >
        {loading ? "生成中..." : "预览"}
      </button>

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="nes-container is-dark max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">预览</h3>
              <button className="nes-btn is-error" onClick={closePreview}>
                关闭
              </button>
            </div>
            <div className="text-center">
              <img 
                src={previewUrl} 
                alt="预览图片" 
                className="max-w-full h-auto border-2 border-gray-600"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}