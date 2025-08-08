import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <section className="nes-container with-title">
        <p className="title">欢迎</p>
        <p>选择一种排名模式开始：</p>
        <div className="mt-4 flex gap-3">
          <Link className="nes-btn is-primary" href="/top">Top 排行模式</Link>
          <Link className="nes-btn" href="/tiers">梯队划分模式</Link>
        </div>
      </section>

      <section className="nes-container with-title">
        <p className="title">特性</p>
        <ul className="list-disc pl-6">
          <li>从游戏库搜索、筛选</li>
          <li>拖拽排序与移动</li>
          <li>导出排名结果为图片</li>
          <li>复古 NES.css 风格界面</li>
        </ul>
      </section>
    </div>
  );
}
