"use client";
import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  pointerWithin,
  closestCenter,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRankingStore } from "@/store/useRankingStore";
import { Game, TierId } from "@/lib/types";
import { GAME_LIBRARY } from "@/lib/games";
import { ThumbnailCard } from "@/components/ThumbnailCard";
import clsx from "clsx";

function SortableGame({
  game,
  onRemove,
}: {
  game: Game;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: game.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    willChange: "transform",
  } as const;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing inline-block"
    >
      <ThumbnailCard game={game} onRemove={() => onRemove(game.id)} />
    </div>
  );
}

export function TierBoard() {
  const { tiers, removeFromTier, moveBetweenTiers, insertIntoTier } =
    useRankingStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const containers: TierId[] = useMemo(
    () => ["T1", "T2", "T3", "T4", "T5"],
    []
  );

  // 修复空容器拖入检测
  const collisionStrategy: CollisionDetection = useMemo(() => {
    return (args) => {
      const pointerHits = pointerWithin(args);
      if (pointerHits.length > 0) {
        return pointerHits;
      }
      return closestCenter(args);
    };
  }, []);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    let sourceTier: TierId | null = null;
    let sourceIndex = -1;
    for (const t of containers) {
      const idx = tiers[t].findIndex((g) => g.id === activeId);
      if (idx !== -1) {
        sourceTier = t;
        sourceIndex = idx;
        break;
      }
    }
    if (!sourceTier) return;

    let destTier: TierId | null = null;
    let destIndex = -1;
    for (const t of containers) {
      const idx = tiers[t].findIndex((g) => g.id === overId);
      if (idx !== -1) {
        destTier = t;
        destIndex = idx;
        break;
      }
    }
    if (!destTier) {
      const maybeTier = containers.find((t) => t === overId);
      if (maybeTier) {
        destTier = maybeTier;
        destIndex = tiers[maybeTier].length;
      }
    }
    if (!destTier) return;

    if (sourceTier === destTier && sourceIndex === destIndex) return;

    if (sourceTier === destTier && destIndex > sourceIndex) destIndex -= 1;
    moveBetweenTiers(sourceTier, destTier, sourceIndex, Math.max(0, destIndex));
  };

  // HTML5 原生拖放
  const GAME_POOL = GAME_LIBRARY as Game[];
  const handleDropOnTier =
    (tier: TierId, index: number | null) =>
    (e: React.DragEvent<HTMLDivElement>) => {
      const id = e.dataTransfer.getData("application/x-game-id");
      if (!id) return;
      e.preventDefault();
      const game = GAME_POOL.find((g) => g.id === id);
      if (!game) return;
      if (index == null) {
        insertIntoTier(tier, Number.MAX_SAFE_INTEGER, game);
      } else {
        insertIntoTier(tier, index, game);
      }
    };

  const handleAllowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("application/x-game-id")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetection={collisionStrategy}
    >
      <div className="flex flex-col gap-6">
        {containers.map((tier) => (
          <div key={tier} className="flex flex-col pixel-rounded">
            <div
              className="nes-container with-title"
              onDragOver={handleAllowDrop}
              onDrop={handleDropOnTier(tier, null)}
            >
              <p className="title">{tier}</p>
              <DroppableTier id={tier}>
                <div className="min-h-40">
                  <SortableContext
                    items={tiers[tier].map((g) => g.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center py-4 select-none"
                      id={tier}
                    >
                      {tiers[tier].length === 0 ? (
                        <div className="flex items-center justify-center col-span-full">
                          <div className="nes-balloon from-left is-dark text-center text-xs opacity-70">
                            拖拽到此处
                          </div>
                        </div>
                      ) : null}
                      {tiers[tier].map((g, idx) => (
                        <div
                          key={g.id}
                          className="shrink-0"
                          onDragOver={handleAllowDrop}
                          onDrop={handleDropOnTier(tier, idx)}
                        >
                          <SortableGame
                            game={g}
                            onRemove={(id) => removeFromTier(tier, id)}
                          />
                        </div>
                      ))}
                      <div
                        className="h-2 col-span-full"
                        onDragOver={handleAllowDrop}
                        onDrop={handleDropOnTier(tier, tiers[tier].length)}
                      />
                    </div>
                  </SortableContext>
                </div>
              </DroppableTier>
            </div>
          </div>
        ))}
      </div>
      <DragOverlay
        dropAnimation={{ duration: 150, easing: "cubic-bezier(.2,.8,.2,1)" }}
      >
        {activeId
          ? (() => {
              const all = containers.flatMap((t) => tiers[t]);
              const g = all.find((x) => x.id === activeId);
              return g ? <ThumbnailCard game={g} /> : null;
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}

function DroppableTier({
  id,
  children,
}: {
  id: TierId;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={clsx(isOver && "outline outline-primary/70")}
    >
      {children}
    </div>
  );
}
