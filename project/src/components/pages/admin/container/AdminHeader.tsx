"use client";

import { Box, Typography, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";

/**
 * 관리자 페이지 헤더 컴포넌트
 * 페이지 제목과 설명을 표시합니다.
 */
const AdminHeader = () => {
  return (
    <>
      <HeaderWrapper>
        {/* 자물쇠 아이콘 */}
        <HeaderIcon />
        {/* 페이지 제목 */}
        <HeaderTitle>관리자 페이지</HeaderTitle>
      </HeaderWrapper>
      {/* 페이지 설명 텍스트 */}
      <HeaderDescription>관리자 기능을 사용하기 위해 비밀번호를 입력하세요.</HeaderDescription>
      {/* 구분선 */}
      <HeaderDivider />
    </>
  );
};

export default AdminHeader;

// 헤더 컨테이너 스타일
const HeaderWrapper = styled(Box)({
  display: "flex", // 가로 배치
  alignItems: "center", // 세로 중앙 정렬
  marginBottom: 24, // 하단 여백
});

// 자물쇠 아이콘 스타일
const HeaderIcon = styled(LockIcon)({
  fontSize: 32, // 아이콘 크기
  marginRight: 16, // 우측 여백
  color: "#1976d2", // 파란색 (primary.main)
});

// 헤더 제목 스타일
const HeaderTitle = styled(Typography)({
  fontWeight: "bold", // 굵은 글씨
  fontSize: "2.125rem", // h4 크기
  lineHeight: 1.235, // 줄 간격
});

// 헤더 설명 텍스트 스타일
const HeaderDescription = styled(Typography)({
  color: "rgba(0, 0, 0, 0.6)", // 회색 (text.secondary)
  marginBottom: 24, // 하단 여백
  fontSize: "1rem", // body1 크기
});

// 구분선 스타일
const HeaderDivider = styled(Divider)({
  marginBottom: 24, // 하단 여백
});
