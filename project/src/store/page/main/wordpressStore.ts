import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WordpressStore {
  wpUrl: string;
  wpId: string;
  wpApplicationPw: string;

  setWpUrl: (wpUrl: string) => void;
  setWpId: (wpId: string) => void;
  setWpApplicationPw: (wpApplicationPw: string) => void;

  setClear: () => void;
}

export const useWordpressStore = create<WordpressStore>()(
  persist(
    (set) => ({
      wpUrl: "",
      wpId: "",
      wpApplicationPw: "",

      setWpUrl: (wpUrl: string) => set({ wpUrl }),
      setWpId: (wpId: string) => set({ wpId }),
      setWpApplicationPw: (wpApplicationPw: string) => set({ wpApplicationPw }),

      setClear: () => set({ wpUrl: "", wpId: "", wpApplicationPw: "" }),
    }),
    {
      name: "wordpress-storage",
    }
  )
);
