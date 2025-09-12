# Game Ranking Tool

一个复古像素风的游戏排行工具，支持 Top 排行与梯队划分，拖拽即排，导出即分享。

访问链接：https://topgameranking.netlify.app/

## 功能特性

- **双模式排行**：支持 Top 5/10 排行榜和 T1-T5 梯队划分
- **拖拽排序**：直观的拖拽操作，支持跨区域移动和任意位置插入
- **游戏搜索**：内置丰富游戏库，支持模糊搜索快速添加
- **图片导出**：一键导出排行结果为图片，方便分享
- **复古界面**：像素风 UI 设计，使用 NES.css 样式库

## 技术栈

- **框架**：Next.js 15 + React 19
- **状态管理**：Zustand
- **拖拽功能**：@dnd-kit
- **搜索功能**：Fuse.js
- **样式**：Tailwind CSS + NES.css
- **图片导出**：html-to-image
- **开发语言**：TypeScript

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── top/page.tsx       # Top 排行模式
│   └── tiers/page.tsx     # 梯队划分模式
├── components/            # 组件库
│   ├── SearchBar.tsx      # 游戏搜索组件
│   ├── GameCard.tsx       # 游戏卡片组件
│   ├── ExportImageButton.tsx  # 图片导出按钮
│   ├── top/               # Top 模式专用组件
│   └── tiers/             # 梯队模式专用组件
├── lib/                   # 工具库
│   ├── types.ts          # 类型定义
│   └── games.ts          # 游戏数据库
└── store/                 # 状态管理
    └── useRankingStore.ts # 排行数据状态
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 使用说明

### Top 排行模式

1. 选择 Top 5 或 Top 10 模式
2. 在搜索框中查找游戏并添加到排行榜
3. 拖拽游戏卡片调整排名顺序
4. 设置导出标题，点击"导出为图片"分享结果

### 梯队划分模式

1. 搜索并添加游戏到任意梯队（T1-T5）
2. 在不同梯队间拖拽游戏进行分类
3. 调整每个梯队内的游戏顺序
4. 导出完整的梯队划分图片

## 主要依赖

- `@dnd-kit/*` - 拖拽功能实现
- `fuse.js` - 模糊搜索
- `html-to-image` - 图片导出
- `zustand` - 轻量级状态管理
- `nes.css` - 复古像素风样式
- `lucide-react` - 图标库

## 开发

```bash
npm run dev      # 开发模式
npm run build    # 构建
npm run start    # 生产模式启动
npm run lint     # 代码检查
```
