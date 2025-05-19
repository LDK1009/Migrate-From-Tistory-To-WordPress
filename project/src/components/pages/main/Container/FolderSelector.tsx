import { useTistoryStore } from "@/store/page/main/tistoryStore";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useRef, useState, DragEvent } from "react";
import { shouldForwardProp } from "@/utils/mui";
import { DriveFolderUploadRounded, ReplayRounded } from "@mui/icons-material";
import { mixinFlex } from "@/styles/mixins";

const FolderSelector = () => {
  //////////////////////////////////////// 상태 ////////////////////////////////////////
  // 티스토리 스토어
  const { tistoryArticles, setTistoryArticles } = useTistoryStore();
  // 드래그 상태 추가
  const [isDragging, setIsDragging] = useState(false);

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

  ////////// 드래그 인
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  ////////// 드래그 아웃
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  ////////// 드래그 온
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 드래그 중이 아니라면 드래그 상태 업데이트
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  ////////// 드래그 드롭
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    openFileInput();
  };

  ////////// 파일 선택기 열기
  const openFileInput = () => {
    fileInputRef.current?.click();
  };

  //////////////////////////////////////// 렌더링 ////////////////////////////////////////
  return (
    <Container>
      {tistoryArticles.length > 0 ? (
        // 재업로드 버튼
        <RetryButton variant="outlined" endIcon={<ReplayRounded />} onClick={openFileInput}>
          다시 업로드하기
        </RetryButton>
      ) : (
        // DnD 박스
        <DropBoxContainer
          onClick={openFileInput}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          $isDragging={isDragging}
        >
          <UploadFolderIcon />
          <UploadFolderText variant="h5">
            {isDragging ? "여기에 폴더를 놓으세요" : "티스토리 백업 폴더를 선택하세요"}
          </UploadFolderText>
        </DropBoxContainer>
      )}

      {/* 숨겨진 인풋 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => selectFolder(e.target.files as FileList)}
        style={{ display: "none" }}
        {...{ webkitdirectory: "", directory: "" }}
      />
    </Container>
  );
};

export default FolderSelector;

//////////////////////////////////////// 스타일 컴포넌트 ////////////////////////////////////////
const Container = styled(Box)`
  width: 100%;
  height: 100%;
`;

const RetryButton = styled(Button)`
  width: 100%;
  height: 48px;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
`;

type ContainerProps = {
  $isDragging?: boolean;
};

const DropBoxContainer = styled(Stack, { shouldForwardProp })<ContainerProps>`
  width: 100%;
  height: 500px;
  ${mixinFlex("column", "center", "center")}

  border: 3px dashed ${({ theme }) => theme.palette.primary.main};
  border-radius: 16px;

  transition: background-color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    background-color: ${({ theme }) => theme.palette.primary.light};
    cursor: pointer;
  }
`;

const UploadFolderIcon = styled(DriveFolderUploadRounded)`
  width: 100px;
  height: 100px;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const UploadFolderText = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
`;
