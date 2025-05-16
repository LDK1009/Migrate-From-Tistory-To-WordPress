"use client";

import { Box, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import AdminHeader from "./container/AdminHeader";
import AdminPasswordSection from "./container/AdminPasswordSection";
import AdminFunctionList from "./container/AdminFunctionList";

/**
 * 관리자 페이지의 메인 컨테이너 컴포넌트
 * 전체 관리자 UI를 감싸는 역할을 합니다.
 */
const AdminContainer = () => {
  return (
    <ContainerBox>
      <AdminWrapper elevation={3}>
        {/* 관리자 페이지 헤더 섹션 */}
        <AdminHeader />
        {/* 관리자 인증 섹션 */}
        <AdminPasswordSection />
        {/* 관리자 기능 목록 섹션 */}
        <AdminFunctionList />
      </AdminWrapper>
    </ContainerBox>
  );
};

export default AdminContainer;

// 전체 컨테이너를 감싸는 박스 스타일
const ContainerBox = styled(Box)({
  padding: 16, // 전체 패딩
});

// 관리자 UI를 담는 페이퍼 컴포넌트 스타일
const AdminWrapper = styled(Paper)({
  padding: 24, // 내부 패딩
  maxWidth: 800, // 최대 너비 제한
  margin: "0 auto", // 가운데 정렬
  marginTop: 32, // 상단 여백
  marginBottom: 32, // 하단 여백
});
