"use client";

import { useState } from "react";
import { Box, TextField, Button, InputAdornment, IconButton, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

/**
 * 관리자 인증 섹션 컴포넌트
 * 관리자 비밀번호 입력 및 인증 처리를 담당합니다.
 */
const AdminPasswordSection = () => {
  // 비밀번호 상태 관리
  const [password, setPassword] = useState("");
  // 비밀번호 표시/숨김 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  // 인증 상태 관리
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 오류 메시지 상태 관리
  const [error, setError] = useState("");

  /**
   * 비밀번호 입력값 변경 핸들러
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(""); // 입력 시 오류 메시지 초기화
  };

  /**
   * 비밀번호 표시/숨김 토글 핸들러
   */
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * 관리자 인증 처리 핸들러
   * 실제 구현에서는 서버에 인증 요청을 보내야 합니다.
   */
  const handleAuthenticate = () => {
    if (password === "dlrlwk76023317!!") {
      // 예시 비밀번호
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <PasswordWrapper>
      <SectionTitle>관리자 인증</SectionTitle>

      {/* 오류 메시지 표시 */}
      {error && <ErrorAlert severity="error">{error}</ErrorAlert>}
      
      {/* 인증 성공/실패에 따른 UI 분기 */}
      {isAuthenticated ? (
        // 인증 성공 시 성공 메시지 표시
        <SuccessAlert severity="success">인증되었습니다. 이제 관리자 기능을 사용할 수 있습니다.</SuccessAlert>
      ) : (
        // 인증 전 비밀번호 입력 UI 표시
        <InputContainer>
          {/* 비밀번호 입력 필드 */}
          <PasswordField
            fullWidth
            label="관리자 비밀번호"
            type={showPassword ? "text" : "password"} // 비밀번호 표시/숨김 상태에 따라 타입 변경
            value={password}
            onChange={handlePasswordChange}
            variant="outlined"
            InputProps={{
              // 비밀번호 표시/숨김 토글 버튼
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* 인증 버튼 */}
          <AuthButton variant="contained" color="primary" onClick={handleAuthenticate}>
            인증
          </AuthButton>
        </InputContainer>
      )}
    </PasswordWrapper>
  );
};

export default AdminPasswordSection;

// 비밀번호 섹션 컨테이너 스타일
const PasswordWrapper = styled(Box)({
  marginBottom: 32, // 하단 여백
});

// 섹션 제목 스타일
const SectionTitle = styled(Typography)({
  fontSize: "1.25rem", // h6 크기
  fontWeight: 500, // 중간 굵기
  marginBottom: 16, // 하단 여백
});

// 오류 알림 스타일
const ErrorAlert = styled(Alert)({
  marginBottom: 16, // 하단 여백
});

// 성공 알림 스타일
const SuccessAlert = styled(Alert)({
  marginBottom: 16, // 하단 여백
});

// 입력 컨테이너 스타일
const InputContainer = styled(Box)({
  display: "flex", // 가로 배치
  gap: 16, // 요소 간 간격
});

// 비밀번호 입력 필드 스타일
const PasswordField = styled(TextField)({
  // 기본 스타일은 MUI에서 제공
});

// 인증 버튼 스타일
const AuthButton = styled(Button)({
  minWidth: 100, // 최소 너비
});
