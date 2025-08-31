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

// 游戏库中的游戏类型（扩展了基础Game类型）
interface LibraryGame extends Game {
  platform?: string;
  year?: number;
}

// 像素描边文字类名
const pixelText =
  "relative text-white font-bold tracking-widest text-shadow-black";

// 添加游戏按钮组件
function AddGameButton({ 
  tierId, 
  onAddGame 
}: { 
  tierId: TierId;
  onAddGame: (tierId: TierId) => void;
}) {
  return (
    <button
      className="nes-btn is-primary w-24 h-32 flex flex-col items-center justify-center text-2xl font-bold border-4 border-black hover:scale-105 transition-transform"
      onClick={() => onAddGame(tierId)}
    >
      +
    </button>
  );
}

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
      className="cursor-grab active:cursor-grabbing inline-block transition-transform duration-150 hover:scale-105 hover:drop-shadow-[2px_2px_0_#000]"
    >
      <ThumbnailCard game={game} onRemove={() => onRemove(game.id)} />
    </div>
  );
}

export function TierBoard() {
  const { tiers, removeFromTier, moveBetweenTiers, insertIntoTier } =
    useRankingStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<TierId>("T1");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LibraryGame[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const containers: TierId[] = useMemo(
    () => ["T1", "T2", "T3", "T4", "T5"],
    []
  );

  // 梯队主题颜色
  const tierColors: Record<TierId, string> = {
    T1: "from-pink-400 to-pink-600",
    T2: "from-yellow-400 to-yellow-600",
    T3: "from-green-400 to-green-600",
    T4: "from-blue-400 to-blue-600",
    T5: "from-purple-400 to-purple-600",
  };

  // 拖拽碰撞策略
  const collisionStrategy: CollisionDetection = useMemo(() => {
    return (args) => {
      const pointerHits = pointerWithin(args);
      if (pointerHits.length > 0) return pointerHits;
      return closestCenter(args);
    };
  }, []);

  const onDragStart = (event: DragStartEvent) =>
    setActiveId(String(event.active.id));
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

  const GAME_POOL = GAME_LIBRARY as LibraryGame[];
  const handleDropOnTier =
    (tier: TierId, index: number | null) =>
    (e: React.DragEvent<HTMLDivElement>) => {
      const id = e.dataTransfer.getData("application/x-game-id");
      if (!id) return;
      e.preventDefault();
      const game = GAME_POOL.find((g) => g.id === id);
      if (!game) return;
      
      // 检查游戏是否已经在任何梯队中
      const allTierIds: TierId[] = ["T1", "T2", "T3", "T4", "T5"];
      const gameExistsInAnyTier = allTierIds.some(t => 
        tiers[t].find((g) => g.id === game.id)
      );
      
      if (gameExistsInAnyTier) return;
      
      const gameToAdd: Game = {
        id: game.id,
        title: game.title,
        platform: game.platform,
        year: game.year
      };
      
      insertIntoTier(tier, index ?? Number.MAX_SAFE_INTEGER, gameToAdd);
    };

  const handleAllowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes("application/x-game-id")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleAddGame = (tierId: TierId) => {
    setSelectedTierId(tierId);
    setShowDialog(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // 从游戏库中搜索
      const results = (GAME_LIBRARY as LibraryGame[]).filter((game) =>
        game.title.toLowerCase().includes(query.toLowerCase())
      ).filter((game) => {
        // 过滤掉已经在任何梯队中的游戏
        const allTierIds: TierId[] = ["T1", "T2", "T3", "T4", "T5"];
        return !allTierIds.some(t => 
          tiers[t].find((g) => g.id === game.id)
        );
      }).slice(0, 10); // 限制结果数量
      
      setSearchResults(results);
    } catch (error) {
      console.error("搜索失败:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectGame = (game: LibraryGame) => {
    const gameToAdd: Game = {
      id: game.id,
      title: game.title,
      platform: game.platform,
      year: game.year
    };
    insertIntoTier(selectedTierId, tiers[selectedTierId].length, gameToAdd);
    setShowDialog(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSearchQuery("");
    setSearchResults([]);
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
          <div key={tier} className="flex flex-col pixel-rounded relative">
            <div
              className={clsx(
                "nes-container with-title relative overflow-hidden border-4 border-black",
                "bg-gradient-to-br",
                tierColors[tier],
                "before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,#000_0_1px,transparent_1px_2px)] before:opacity-10" // CRT扫描线
              )}
              onDragOver={handleAllowDrop}
              onDrop={handleDropOnTier(tier, null)}
            >
              {/* NES 风格像素标题 */}
              <p
                className={clsx(
                  "title px-3 py-1 tracking-widest text-black font-bold relative z-10",
                  "text-shadow-black",
                  tier === "T1" && "bg-pink-800",
                  tier === "T2" && "bg-yellow-800",
                  tier === "T3" && "bg-green-800",
                  tier === "T4" && "bg-blue-800",
                  tier === "T5" && "bg-purple-800",
                  "border-b-4 border-black"
                )}
              >
                {tier}
              </p>

              <DroppableTier id={tier}>
                <div className="min-h-40 py-4">
                  <SortableContext
                    items={tiers[tier].map((g) => g.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center select-none"
                      key={`${tier}-${tiers[tier].map(g => g.id).join('-')}-${tiers[tier].length}`}
                      data-tier={tier}
                      data-games={tiers[tier].map(g => g.id).join(',')}
                    >
                      {tiers[tier].length === 0 && (
                        <div className="flex items-center justify-center col-span-full animate-pulse">
                          <div className="nes-balloon from-left is-dark text-center text-xs opacity-70">
                            拖拽到此处
                          </div>
                        </div>
                      )}

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
                      
                      {/* 添加游戏按钮 */}
                      <div className="shrink-0 print:hidden">
                        <AddGameButton tierId={tier} onAddGame={handleAddGame} />
                      </div>
                      
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

      {/* 拖拽中的元素 */}
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

      {/* 全局添加游戏对话框 */}
      {showDialog && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={closeDialog}
        >
          <div 
            className="nes-dialog is-rounded bg-white p-6 w-96 max-w-lg shadow-2xl"
            style={{ zIndex: 10000, minHeight: '300px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <form method="dialog">
              <p className="title mb-6 text-lg font-bold text-center">🎮 添加游戏到 {selectedTierId}</p>
              
              <div className="nes-field mb-6">
                <label htmlFor="game-search" className="block mb-3 font-semibold">搜索游戏名称:</label>
                <input
                  type="text"
                  id="game-search"
                  className="nes-input w-full text-base"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="输入游戏名称进行搜索..."
                  autoFocus
                />
              </div>

              {isSearching && (
                <div className="text-center py-6">
                  <div className="nes-text is-primary">🔍 搜索中...</div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">找到 {searchResults.length} 个结果:</div>
                  <div className="max-h-48 overflow-y-auto border-2 border-black p-3 bg-gray-50">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        className="nes-container is-dark p-3 mb-2 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => handleSelectGame(game)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{game.title}</span>
                          <span className="text-xs text-gray-500">{game.year}</span>
                        </div>
                        {game.platform && (
                          <div className="text-xs text-gray-400 mt-1">{game.platform}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="text-center py-4 text-gray-500">
                  <div className="nes-text">😔 未找到相关游戏</div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="nes-btn is-error" 
                  type="button" 
                  onClick={closeDialog}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      className={clsx(
        "transition-all duration-150",
        isOver &&
          "outline outline-4 outline-yellow-400 animate-pulse before:absolute before:inset-0 before:bg-yellow-200 before:opacity-20"
      )}
    >
      {children}
    </div>
  );
}