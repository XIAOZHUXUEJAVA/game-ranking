import { create } from "zustand";
import { Game, TierId } from "@/lib/types";

type RankingMode = "top" | "tiers";

export type TiersState = Record<TierId, Game[]>;

type RankingState = {
  mode: RankingMode;
  topMax: 5 | 10;
  topGames: Game[];
  tiers: TiersState;
  // actions
  setMode: (mode: RankingMode) => void;
  setTopMax: (n: 5 | 10) => void;
  addToTop: (game: Game) => void;
  insertIntoTop: (index: number, game: Game) => void;
  removeFromTop: (gameId: string) => void;
  reorderTop: (fromIndex: number, toIndex: number) => void;
  clearTop: () => void;
  addToTier: (tier: TierId, game: Game) => void;
  insertIntoTier: (tier: TierId, index: number, game: Game) => void;
  removeFromTier: (tier: TierId, gameId: string) => void;
  moveBetweenTiers: (
    sourceTier: TierId,
    destTier: TierId,
    sourceIndex: number,
    destIndex: number
  ) => void;
  clearTiers: () => void;
};

const emptyTiers = (): TiersState => ({
  T1: [],
  T2: [],
  T3: [],
  T4: [],
  T5: [],
});

export const useRankingStore = create<RankingState>((set, get) => ({
  mode: "top",
  topMax: 10,
  topGames: [],
  tiers: emptyTiers(),

  setMode: (mode) => set({ mode }),
  setTopMax: (n) => set({ topMax: n, topGames: get().topGames.slice(0, n) }),

  addToTop: (game) =>
    set((state) => {
      if (state.topGames.find((g) => g.id === game.id)) return state;
      if (state.topGames.length >= state.topMax) return state;
      return { topGames: [...state.topGames, game] };
    }),

  insertIntoTop: (index, game) =>
    set((state) => {
      if (state.topGames.find((g) => g.id === game.id)) return state;
      if (state.topGames.length >= state.topMax) return state;
      const arr = [...state.topGames];
      const safeIndex = Math.max(0, Math.min(index, arr.length));
      arr.splice(safeIndex, 0, game);
      return { topGames: arr };
    }),

  removeFromTop: (gameId) =>
    set((state) => ({
      topGames: state.topGames.filter((g) => g.id !== gameId),
    })),

  reorderTop: (fromIndex, toIndex) =>
    set((state) => {
      const arr = [...state.topGames];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return { topGames: arr };
    }),

  clearTop: () => set({ topGames: [] }),

  addToTier: (tier, game) =>
    set((state) => {
      if (state.tiers[tier].find((g) => g.id === game.id)) return state;
      return {
        tiers: { ...state.tiers, [tier]: [...state.tiers[tier], game] },
      };
    }),

  insertIntoTier: (tier, index, game) =>
    set((state) => {
      if (state.tiers[tier].find((g) => g.id === game.id)) return state;
      const arr = [...state.tiers[tier]];
      const safeIndex = Math.max(0, Math.min(index, arr.length));
      arr.splice(safeIndex, 0, game);
      return { tiers: { ...state.tiers, [tier]: arr } };
    }),

  removeFromTier: (tier, gameId) =>
    set((state) => ({
      tiers: {
        ...state.tiers,
        [tier]: state.tiers[tier].filter((g) => g.id !== gameId),
      },
    })),

  moveBetweenTiers: (sourceTier, destTier, sourceIndex, destIndex) =>
    set((state) => {
      const next: TiersState = {
        T1: [...state.tiers.T1],
        T2: [...state.tiers.T2],
        T3: [...state.tiers.T3],
        T4: [...state.tiers.T4],
        T5: [...state.tiers.T5],
      };
      const [moved] = next[sourceTier].splice(sourceIndex, 1);
      next[destTier].splice(destIndex, 0, moved);
      return { tiers: next };
    }),

  clearTiers: () => set({ tiers: emptyTiers() }),
}));

export const getAllUsedGameIds = (state: RankingState): string[] => {
  const ids = new Set<string>();
  state.topGames.forEach((g) => ids.add(g.id));
  (Object.keys(state.tiers) as TierId[]).forEach((t) =>
    state.tiers[t].forEach((g) => ids.add(g.id))
  );
  return Array.from(ids);
};
