"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { emptyBucket } from "@/service/bucket/articles";

/**
 * 관리자 기능 목록 컴포넌트
 * 버킷 비우기 등 관리자 기능을 제공합니다.
 */
const AdminFunctionList = () => {
  // 다이얼로그 열림/닫힘 상태 관리
  const [openDialog, setOpenDialog] = useState(false);
  // 로딩 상태 관리
  const [loading, setLoading] = useState(false);
  // 워드프레스 아이디 입력값 상태 관리
  const [wordpressId, setWordpressId] = useState("");
  // 오류 메시지 상태 관리
  const [error, setError] = useState("");

  /**
   * 다이얼로그 열기 핸들러
   */
  const handleOpenDialog = () => {
    setWordpressId(""); // 입력값 초기화
    setError(""); // 오류 메시지 초기화
    setOpenDialog(true);
  };

  /**
   * 다이얼로그 닫기 핸들러
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  /**
   * 워드프레스 아이디 입력값 변경 핸들러
   */
  const handleWordpressIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWordpressId(e.target.value);
    setError(""); // 입력 시 오류 메시지 초기화
  };

  /**
   * 버킷 비우기 실행 핸들러
   * 실제 구현에서는 서버에 요청을 보내야 합니다.
   */
  const handleClearBucket = async () => {
    try {
      // 입력값 검증
      if (!wordpressId) {
        setError("워드프레스 아이디를 입력해주세요.");
        return;
      }

      // 로딩 상태 시작
      setLoading(true);

      await emptyBucket(wordpressId);
    } catch (error) {
      console.error(error);
      setError("작업 중 오류가 발생했습니다.");
    } finally {
      // 로딩 상태 종료
      setLoading(false);
    }
  };

  return (
    <FunctionWrapper>
      <SectionTitle>관리자 기능</SectionTitle>

      {/* 버킷 비우기 기능 아이템 */}
      <FunctionItem>
        <FunctionContent>
          {/* 기능 아이콘 */}
          <IconContainer>
            <DeleteIconStyled color="error" />
          </IconContainer>
          {/* 기능 설명 텍스트 */}
          <TextContainer>
            <FunctionTitle>버킷 비우기</FunctionTitle>
            <FunctionDescription>서버의 임시 저장소를 비웁니다. 이 작업은 되돌릴 수 없습니다.</FunctionDescription>
          </TextContainer>
          {/* 실행 버튼 */}
          <ActionButton variant="contained" color="error" onClick={handleOpenDialog} size="small">
            실행
          </ActionButton>
        </FunctionContent>
      </FunctionItem>

      {/* 확인 다이얼로그 */}
      <ConfirmDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>버킷 비우기</DialogTitle>
        <DialogContent>
          {/* 경고 메시지 */}
          <DialogText>
            정말로 서버의 임시 저장소를 비우시겠습니까? 이 작업은 되돌릴 수 없습니다. 계속하려면 워드프레스 아이디를
            입력하세요.
          </DialogText>
          {/* 워드프레스 아이디 입력 필드 */}
          <IdTextField
            autoFocus
            fullWidth
            label="워드프레스 아이디"
            value={wordpressId}
            onChange={handleWordpressIdChange}
            error={!!error}
            helperText={error}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          {/* 취소 버튼 */}
          <CancelButton onClick={handleCloseDialog} color="inherit">
            취소
          </CancelButton>
          {/* 확인 버튼 */}
          <ConfirmButton
            onClick={handleClearBucket}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "처리 중..." : "확인"}
          </ConfirmButton>
        </DialogActions>
      </ConfirmDialog>
    </FunctionWrapper>
  );
};

export default AdminFunctionList;

// 기능 목록 컨테이너 스타일
const FunctionWrapper = styled(Box)({
  marginTop: 16, // 상단 여백
});

// 섹션 제목 스타일
const SectionTitle = styled(Typography)({
  fontSize: "1.25rem", // h6 크기
  fontWeight: 500, // 중간 굵기
  marginBottom: 16, // 하단 여백
});

// 기능 아이템 스타일
const FunctionItem = styled(Paper)({
  padding: 16, // 내부 패딩
  marginBottom: 16, // 하단 여백
  display: "flex", // 가로 배치
  alignItems: "center", // 세로 중앙 정렬
  border: "1px solid #e0e0e0", // 테두리
  borderRadius: 8, // 모서리 둥글기
});

// 기능 내용 컨테이너 스타일
const FunctionContent = styled(Box)({
  display: "flex", // 가로 배치
  alignItems: "center", // 세로 중앙 정렬
  width: "100%", // 전체 너비
});

// 아이콘 컨테이너 스타일
const IconContainer = styled(Box)({
  marginRight: 16, // 우측 여백
});

// 삭제 아이콘 스타일
const DeleteIconStyled = styled(DeleteIcon)({
  // 기본 스타일은 MUI에서 제공
});

// 텍스트 컨테이너 스타일
const TextContainer = styled(Box)({
  flexGrow: 1, // 남은 공간 차지
});

// 기능 제목 스타일
const FunctionTitle = styled(Typography)({
  fontWeight: "bold", // 굵은 글씨
  fontSize: "1rem", // subtitle1 크기
});

// 기능 설명 스타일
const FunctionDescription = styled(Typography)({
  fontSize: "0.875rem", // body2 크기
  color: "rgba(0, 0, 0, 0.6)", // 회색 (text.secondary)
});

// 실행 버튼 스타일
const ActionButton = styled(Button)({
  // 기본 스타일은 MUI에서 제공
});

// 확인 다이얼로그 스타일
const ConfirmDialog = styled(Dialog)({
  // 기본 스타일은 MUI에서 제공
});

// 다이얼로그 텍스트 스타일
const DialogText = styled(DialogContentText)({
  marginBottom: 16, // 하단 여백
});

// 아이디 입력 필드 스타일
const IdTextField = styled(TextField)({
  marginBottom: 8, // 하단 여백
});

// 취소 버튼 스타일
const CancelButton = styled(Button)({
  // 기본 스타일은 MUI에서 제공
});

// 확인 버튼 스타일
const ConfirmButton = styled(Button)({
  // 기본 스타일은 MUI에서 제공
});
