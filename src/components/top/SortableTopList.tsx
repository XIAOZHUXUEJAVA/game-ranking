"use client";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRankingStore } from "@/store/useRankingStore";
import { Game } from "@/lib/types";
import { ThumbnailCard } from "@/components/ThumbnailCard";
import { GAME_LIBRARY } from "@/lib/games";
import { useCallback } from "react";

// 定义前 3 名的复古颜色
const rankColors = [
  "background: linear-gradient(#ffd75e, #ffbf3f); color: #000;", // 金色
  "background: linear-gradient(#c0c0c0, #a0a0a0); color: #000;", // 银色
  "background: linear-gradient(#cd7f32, #a0522d); color: #fff;", // 铜色
];

function SortableItem({
  game,
  index,
  onRemove,
}: {
  game: Game;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: game.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // 判断前3名用特殊样式
  const badgeStyle =
    index < 3 ? rankColors[index] : "background: #212529; color: #fff;"; // 默认深色

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-block"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="nes-badge">
          <span className="is-dark" style={{ ...parseBadgeStyle(badgeStyle) }}>
            #{index + 1}
          </span>
        </span>
      </div>
      <ThumbnailCard game={game} onRemove={() => onRemove(game.id)} />
    </div>
  );
}

// 辅助函数：把 inline CSS 字符串转对象
function parseBadgeStyle(styleString: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return styleString.split(";").reduce((acc: any, rule) => {
    const [prop, value] = rule.split(":").map((s) => s && s.trim());
    if (prop && value) {
      const jsProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[jsProp] = value;
    }
    return acc;
  }, {});
}

export function SortableTopList() {
  const { topGames, reorderTop, removeFromTop, insertIntoTop } =
    useRankingStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = topGames.findIndex((g) => g.id === active.id);
    const newIndex = topGames.findIndex((g) => g.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderTop(oldIndex, newIndex);
    }
  };

  const allowDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("application/x-game-id")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDropOnIndex = useCallback(
    (index: number | null) => (e: React.DragEvent<HTMLDivElement>) => {
      const id = e.dataTransfer.getData("application/x-game-id");
      if (!id) return;
      e.preventDefault();
      const game = GAME_LIBRARY.find((g) => g.id === id);
      if (!game) return;
      const insertIndex = index == null ? topGames.length : index;
      insertIntoTop(insertIndex, game);
    },
    [insertIntoTop, topGames.length]
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext
        items={topGames.map((g) => g.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          onDragOver={allowDrop}
          onDrop={handleDropOnIndex(null)}
        >
          {topGames.map((g, idx) => (
            <div
              key={g.id}
              onDragOver={allowDrop}
              onDrop={handleDropOnIndex(idx)}
              className="justify-self-center"
            >
              <SortableItem game={g} index={idx} onRemove={removeFromTop} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
