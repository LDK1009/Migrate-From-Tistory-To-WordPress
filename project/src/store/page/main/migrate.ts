import { create } from "zustand";

//////////////////////////////////////// 스토어 타입 ////////////////////////////////////////
interface MigrateStore {
  // 상태
  migrateState: "idle" | "fileUpload" | "articleMigrate" | "success" | "error";

  // 액션
  setMigrateState: (migrateState: "idle" | "fileUpload" | "articleMigrate" | "success" | "error") => void;
}

//////////////////////////////////////// 스토어 ////////////////////////////////////////
export const useMigrateStore = create<MigrateStore>((set) => ({
  // 상태
  migrateState: "idle",

  // 액션
  setMigrateState: (migrateState: "idle" | "fileUpload" | "articleMigrate" | "success" | "error") =>
    set({ migrateState }),
}));
