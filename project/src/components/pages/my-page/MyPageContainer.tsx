"use client";

import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import { styled, Stack } from "@mui/material";
import { mixinContainer } from "@/styles/mixins";
import AccountInformation from "./AccountInformation";
import MenuList from "./MenuList";
import ButtonGroup from "./ButtonGroup";

const MyPageContainer = () => {
  //////////////////////////////////////// State ////////////////////////////////////////
  const { user } = useAuthStore();

  //////////////////////////////////////// Hooks ////////////////////////////////////////
  const router = useRouter();

  //////////////////////////////////////// Effects ////////////////////////////////////////
  // Effects - 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!user.isSignIn) {
      router.push("/auth/sign-in");
    }
  }, [user.isSignIn, router]);

  //////////////////////////////////////// Render ////////////////////////////////////////

  return (
    <Container>
      <Header />
      <AccountInformation />
      <MenuList />
      <ButtonGroup />
    </Container>
  );
};

export default MyPageContainer;

// 메인 컨테이너 스타일
const Container = styled(Stack)`
  ${mixinContainer()};
  row-gap: 24px;
  background-color: ${({ theme }) => theme.palette.background.default};
`;
