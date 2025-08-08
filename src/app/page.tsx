import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero */}
      <section className="nes-container is-dark with-title pixel-shadow">
        <p className="title">欢迎</p>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1
              className="retro-title text-2xl md:text-3xl mb-2"
              style={{ fontFamily: "var(--font-press-start)" }}
            >
              RANK GAME
            </h1>
            <p className="opacity-80 text-sm md:text-base">
              创建你的游戏 Top 排行或梯队划分，拖拽调整，导出图片，一键分享。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link className="nes-btn is-primary" href="/top">
                进入 Top 模式
              </Link>
              <Link className="nes-btn" href="/tiers">
                进入梯队模式
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <i className="nes-icon trophy is-large" aria-hidden />
            <i className="nes-icon heart is-large" aria-hidden />
            <i className="nes-icon star is-large" aria-hidden />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="nes-container with-title pixel-shadow">
        <p className="title">特性</p>
        <ul className="nes-list is-disc">
          <li>从游戏库搜索、筛选</li>
          <li>拖拽排序与移动（支持跨列表）</li>
          <li>导出排名结果为图片</li>
          <li>复古像素风</li>
        </ul>
      </section>
    </div>
  );
}
