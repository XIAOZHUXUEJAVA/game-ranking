import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-6 space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden nes-container is-dark with-title pixel-shadow pixel-rounded">
        <div
          className="absolute -top-10 -right-10 opacity-10 text-[160px] select-none"
          aria-hidden
        >
          ★
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="retro-title text-3xl md:text-4xl leading-tight">
                RANK GAME
              </h1>
            </div>{" "}
            <p className="mt-3 opacity-80 text-sm md:text-base">
              复古像素风的游戏排行工具：支持 Top
              排行与梯队划分，拖拽即排，导出即分享。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link className="nes-btn is-primary pixel-rounded" href="/top">
                进入排行模式
              </Link>
              <Link className="nes-btn pixel-rounded" href="/tiers">
                进入梯队模式
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4  ">
            <div className="flex items-center gap-4 text-4xl" aria-hidden>
              <i className="nes-icon trophy is-large" />
              <i className="nes-icon heart is-large" />
              <i className="nes-icon star is-large" />
            </div>
            <div className="nes-balloon from-left text-center text-xl opacity-80 text-amber-300">
              WELCOME!
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="nes-container with-title pixel-shadow mt-8 pixel-rounded">
        <p className="title">如何使用</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="mb-2 nes-badge">
              <span className="is-dark">步骤 1</span>
            </div>
            <p className="text-sm opacity-80">
              在“添加游戏”里搜索想要的游戏，点击或从搜索结果直接拖拽到目标列表/梯队。
            </p>
          </div>
          <div>
            <div className="mb-2 nes-badge">
              <span className="is-dark">步骤 2</span>
            </div>
            <p className="text-sm opacity-80">
              在列表或梯队中拖动卡片进行排序，支持跨区域拖拽和任意位置插入。
            </p>
          </div>
          <div>
            <div className="mb-2 nes-badge">
              <span className="is-dark">步骤 3</span>
            </div>
            <p className="text-sm opacity-80">
              设置导出标题，点击“导出为图片”，分享你的最终作品。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
