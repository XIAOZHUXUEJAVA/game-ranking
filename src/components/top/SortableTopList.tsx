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
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRankingStore } from "@/store/useRankingStore";
import { Game } from "@/lib/types";
import { GameCard } from "@/components/GameCard";
import { GAME_LIBRARY } from "@/lib/games";
import { useCallback } from "react";

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
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3"
    >
      <span className="nes-badge">
        <span className="is-dark">#{index + 1}</span>
      </span>
      <GameCard game={game} onRemove={onRemove} className="flex-1" />
    </div>
  );
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

  // Allow native drag from SearchBar results
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
          className="flex flex-col gap-3"
          onDragOver={allowDrop}
          onDrop={handleDropOnIndex(null)}
        >
          {topGames.map((g, idx) => (
            <div
              key={g.id}
              onDragOver={allowDrop}
              onDrop={handleDropOnIndex(idx)}
            >
              <SortableItem game={g} index={idx} onRemove={removeFromTop} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
