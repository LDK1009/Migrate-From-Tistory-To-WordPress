import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";

const FolderSelector = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////
  // 티스토리 스토어
  const { setTistoryArticles } = useTistoryStore();

  //////////////////////////////////////// 훅 ////////////////////////////////////////
  ////////// 폴더 선택기 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  //////////////////////////////////////// 함수 ////////////////////////////////////////
  ////////// 폴더 선택 이벤트 핸들러
  const selectFolder = (files: FileList | null) => {
    try {
      // 폴더 선택 여부 확인
      if (!files) {
        throw new Error("폴더를 선택해주세요.");
      }

      // 상태 업데이트
      setTistoryArticles(files);
    } catch (error) {
      enqueueSnackbar((error as Error).message, {
        variant: "error",
      });
    }
  };

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <div>
      <Button variant="outlined" onClick={() => fileInputRef.current?.click()} sx={{ mr: 2 }}>
        폴더 선택
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => selectFolder(e.target.files as FileList)}
        style={{ display: "none" }}
        {...{ webkitdirectory: "", directory: "" }}
      />
    </div>
  );
};

export default FolderSelector;
