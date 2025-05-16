import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WordpressStore {
  // 상태
  wpUrl: string;
  wpId: string;
  wpApplicationPw: string;

  // 오류 상태
  wpUrlError: boolean;

  // 액션
  setWpUrl: (wpUrl: string) => void;
  setWpId: (wpId: string) => void;
  setWpApplicationPw: (wpApplicationPw: string) => void;

  setWpUrlError: (wpUrlError: boolean) => void;

  setClear: () => void;
}

export const useWordpressStore = create<WordpressStore>()(
  persist(
    (set) => ({
      // 상태
      wpUrl: "",
      wpId: "",
      wpApplicationPw: "",

      // 오류 상태
      wpUrlError: false,

      // 액션
      setWpUrl: (wpUrl: string) => set({ wpUrl }),
      setWpId: (wpId: string) => set({ wpId }),
      setWpApplicationPw: (wpApplicationPw: string) => set({ wpApplicationPw }),

      setWpUrlError: (wpUrlError: boolean) => set({ wpUrlError }),

      setClear: () => set({ wpUrl: "", wpId: "", wpApplicationPw: "", wpUrlError: false }),
    }),
    {
      name: "wordpress-storage",
    }
  )
);
