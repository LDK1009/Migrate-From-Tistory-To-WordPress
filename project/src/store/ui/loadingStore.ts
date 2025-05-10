import { create } from "zustand";

interface StoreType {
  // 상태
  isLoading: boolean;

  // 액션
  setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<StoreType>((set) => ({
  // 상태
  isLoading: false,

  // 액션
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
