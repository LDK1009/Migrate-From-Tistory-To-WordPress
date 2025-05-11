import api from "@/lib/apiClient";
import { TistoryArticleType } from "@/types/tistory";
import { create } from "zustand";

interface TistoryStore {
  tistoryData: TistoryArticleType[];

  setTistoryData: (data: TistoryArticleType[]) => void;
  fetchTistoryData: (files : FileList) => Promise<void>;
}

export const useTistoryStore = create<TistoryStore>((set) => ({
  tistoryData: [],

  // 티스토리 데이터 가져오기
  setTistoryData: (data: TistoryArticleType[]) => {
    set({ tistoryData: data });
  },
  fetchTistoryData: async (files: FileList) => {
    const response = await api.post("/tistory/articles", {
      files: files,
    });

    const { data, error } = await response.data;

    if (error) {
      return;
    }

    set({ tistoryData: data });
  },
}));
